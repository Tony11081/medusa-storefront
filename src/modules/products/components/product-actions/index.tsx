"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { siteContent } from "@lib/site-content"
import {
  getProductPriceData,
  resolveDefaultVariant,
} from "@lib/util/product-content"
import {
  getContinuousYardageNote,
  getPriceRuleLabel,
  getSwatchRequestHref,
  getUseCaseLabel,
} from "@lib/util/product-details"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import QuantitySelect from "@modules/products/components/product-actions/quantity-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

const getOptionValues = (option: HttpTypes.StoreProductOption) => {
  return Array.from(
    new Set((option.values ?? []).map((value) => value.value).filter(Boolean))
  )
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestedVariantId = searchParams.get("v_id")

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [didAdd, setDidAdd] = useState(false)
  const countryCode = useParams().countryCode as string
  const priceRuleLabel = useMemo(() => getPriceRuleLabel(product), [product])
  const continuousYardageNote = useMemo(
    () => getContinuousYardageNote(product),
    [product]
  )
  const useCaseLabel = useMemo(() => getUseCaseLabel(product), [product])
  const swatchRequestHref = useMemo(() => getSwatchRequestHref(product), [product])

  const visibleOptions = useMemo(() => {
    return (product.options || []).filter((option) => getOptionValues(option).length > 1)
  }, [product.options])

  const defaultVariant = useMemo(() => {
    return resolveDefaultVariant(product, requestedVariantId)
  }, [product.variants, requestedVariantId])

  const defaultOptions = useMemo(() => {
    const defaults: Record<string, string> = {}

    for (const option of product.options || []) {
      const values = getOptionValues(option)

      if (values.length === 1) {
        defaults[option.id] = values[0]
      }
    }

    if (defaultVariant) {
      return {
        ...defaults,
        ...(optionsAsKeymap(defaultVariant.options) ?? {}),
      }
    }

    return defaults
  }, [defaultVariant, product.options])

  useEffect(() => {
    setOptions((current) => {
      const nextOptions = {
        ...defaultOptions,
        ...current,
      }

      return isEqual(current, nextOptions) ? current : nextOptions
    })
  }, [defaultOptions])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  const maxQuantity = useMemo(() => {
    if (!selectedVariant) {
      return 10
    }

    if (!selectedVariant.manage_inventory || selectedVariant.allow_backorder) {
      return 10
    }

    if (selectedVariant.inventory_quantity == null) {
      return 10
    }

    return Math.max(1, Math.min(selectedVariant.inventory_quantity || 1, 10))
  }, [selectedVariant])

  useEffect(() => {
    setQuantity((current) => Math.min(current, maxQuantity))
  }, [maxQuantity])

  useEffect(() => {
    setDidAdd(false)
  }, [options, quantity])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant.inventory_quantity == null ||
        (selectedVariant?.inventory_quantity || 0) > 0)
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })

    router.refresh()
    setDidAdd(true)
    setIsAdding(false)
  }

  const priceData = useMemo(
    () => getProductPriceData(product, selectedVariant),
    [product, selectedVariant]
  )

  const estimatedTotal = useMemo(() => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: priceData.currency_code || "USD",
      maximumFractionDigits: 2,
    })

    return formatter.format((priceData.calculated_price_number || 0) * quantity)
  }, [priceData, quantity])

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && visibleOptions.length > 0 && (
            <div className="flex flex-col gap-y-4">
              {visibleOptions.map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <QuantitySelect
          value={quantity}
          onChange={setQuantity}
          max={maxQuantity}
          disabled={!!disabled || isAdding}
        />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <div className="mt-3 rounded-[1.4rem] border border-[var(--brand-line)] bg-[rgba(255,250,244,0.8)] p-4 text-sm leading-6 text-[var(--brand-muted)]">
          <div className="flex items-start justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-soft)]">
              Price
            </span>
            <span className="text-right text-[var(--brand-ink)]">{priceRuleLabel}</span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-soft)]">
              Yardage
            </span>
            <span className="max-w-[220px] text-right">{continuousYardageNote}</span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-soft)]">
              Estimated total
            </span>
            <span className="text-right text-[var(--brand-ink)]">
              {estimatedTotal}
            </span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-soft)]">
              Best for
            </span>
            <span className="max-w-[220px] text-right">{useCaseLabel}</span>
          </div>
          <div className="mt-4 border-t border-[var(--brand-line)] pt-4">
            <p className="text-[var(--brand-ink)]">
              Need a swatch check or project guidance before you commit?
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={swatchRequestHref}
                className="rounded-full border border-[var(--brand-line)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--brand-ink)] transition hover:border-[var(--brand-accent)]"
              >
                Request swatch help
              </a>
              <a
                href={`mailto:${siteContent.supportEmail}`}
                className="text-xs uppercase tracking-[0.18em] text-[var(--brand-soft)] underline decoration-[rgba(16,21,31,0.22)] underline-offset-4"
              >
                {siteContent.supportEmail}
              </a>
            </div>
          </div>
        </div>
        {didAdd && (
          <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Added to cart.{" "}
            <a
              href={`/${countryCode}/cart`}
              className="font-medium underline underline-offset-4"
            >
              View cart
            </a>
          </div>
        )}
        <MobileActions
          product={product}
          variant={selectedVariant}
          visibleOptions={visibleOptions}
          options={options}
          updateOptions={setOptionValue}
          quantity={quantity}
          updateQuantity={setQuantity}
          maxQuantity={maxQuantity}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
