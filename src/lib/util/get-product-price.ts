import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-percentage-diff"
import { convertToLocale } from "./money"

type StoreVariantPrice = {
  amount?: number | null
  currency_code?: string | null
}

const normalizeMoneyAmount = (amount: number, currencyCode: string) => {
  const fractionDigits = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).resolvedOptions().maximumFractionDigits

  return amount / 10 ** fractionDigits
}

const getStoredPrices = (variant: any): StoreVariantPrice[] => {
  if (Array.isArray(variant?.prices) && variant.prices.length) {
    return variant.prices
  }

  if (Array.isArray(variant?.price_set?.prices) && variant.price_set.prices.length) {
    return variant.price_set.prices
  }

  return []
}

export const getPricesForVariant = (variant: any) => {
  if (variant?.calculated_price?.calculated_amount) {
    const currencyCode = variant.calculated_price.currency_code
    const calculatedAmount = normalizeMoneyAmount(
      variant.calculated_price.calculated_amount,
      currencyCode
    )
    const originalAmount = normalizeMoneyAmount(
      variant.calculated_price.original_amount,
      currencyCode
    )

    return {
      calculated_price_number: calculatedAmount,
      calculated_price: convertToLocale({
        amount: calculatedAmount,
        currency_code: currencyCode,
      }),
      original_price_number: originalAmount,
      original_price: convertToLocale({
        amount: originalAmount,
        currency_code: currencyCode,
      }),
      currency_code: currencyCode,
      price_type: variant.calculated_price.calculated_price.price_list_type,
      percentage_diff: getPercentageDiff(
        originalAmount,
        calculatedAmount
      ),
    }
  }

  const storedPrice = getStoredPrices(variant).find(
    (price): price is Required<StoreVariantPrice> =>
      typeof price?.amount === "number" &&
      Number.isFinite(price.amount) &&
      typeof price?.currency_code === "string" &&
      Boolean(price.currency_code)
  )

  if (!storedPrice) {
    return null
  }

  const normalizedAmount = normalizeMoneyAmount(
    storedPrice.amount,
    storedPrice.currency_code
  )

  return {
    calculated_price_number: normalizedAmount,
    calculated_price: convertToLocale({
      amount: normalizedAmount,
      currency_code: storedPrice.currency_code,
    }),
    original_price_number: normalizedAmount,
    original_price: convertToLocale({
      amount: normalizedAmount,
      currency_code: storedPrice.currency_code,
    }),
    currency_code: storedPrice.currency_code,
    price_type: "default",
    percentage_diff: "0",
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => !!getPricesForVariant(v))
      .sort((a: any, b: any) => {
        const priceA = getPricesForVariant(a)
        const priceB = getPricesForVariant(b)

        return (
          (priceA?.calculated_price_number ?? Number.MAX_SAFE_INTEGER) -
          (priceB?.calculated_price_number ?? Number.MAX_SAFE_INTEGER)
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
