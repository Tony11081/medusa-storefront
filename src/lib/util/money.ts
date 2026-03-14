import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const normalizeCurrencyAmount = (
  amount: number,
  currency_code: string
) => {
  const fractionDigits = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency_code,
  }).resolvedOptions().maximumFractionDigits

  return amount / 10 ** fractionDigits
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}

export const convertMinorUnitToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return convertToLocale({
    amount: normalizeCurrencyAmount(amount, currency_code),
    currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
    locale,
  })
}
