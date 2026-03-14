import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React, { useMemo } from "react"

import { normalizeImageUrl } from "@lib/util/images"
import { resolveImagesForVariant } from "@lib/util/product-variant-images"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  product?: HttpTypes.StoreProduct
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  product,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const optionCards = useMemo(() => {
    return filteredOptions.map((value) => {
      const variant = product?.variants?.find((candidate) =>
        (candidate.options ?? []).some(
          (candidateOption) =>
            candidateOption.option_id === option.id && candidateOption.value === value
        )
      )

      const imageUrl = variant
        ? normalizeImageUrl(
            resolveImagesForVariant(product, variant.id, product.images)[0]?.url
          )
        : undefined

      return {
        value,
        imageUrl,
      }
    })
  }, [filteredOptions, option.id, product])

  return (
    <div className="flex flex-col gap-y-3">
      <span className="soft-caption text-[var(--brand-soft)]">Select {title}</span>
      <div
        className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
        data-testid={dataTestId}
      >
        {optionCards.map(({ value, imageUrl }) => {
          return (
            <button
              onClick={() => updateOption(option.id, value)}
              key={value}
              className={clx(
                "flex min-h-12 items-center justify-start gap-3 rounded-[2px] border px-3 py-3 text-left text-sm transition duration-300 sm:min-h-11 sm:px-4",
                {
                  "border-[var(--brand-ink)] bg-[var(--brand-ink)] text-[var(--brand-paper)]":
                    value === current,
                  "border-[var(--brand-line-strong)] bg-[rgba(252,251,248,0.82)] text-[var(--brand-muted)] hover:border-[var(--brand-ink)] hover:text-[var(--brand-ink)]":
                    value !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              <span
                className={clx(
                  "h-8 w-8 shrink-0 rounded-full border border-[rgba(32,37,33,0.14)] bg-[var(--brand-panel-strong)]",
                  {
                    "border-white/35": value === current,
                  }
                )}
                style={
                  imageUrl
                    ? {
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }
                    : undefined
                }
                aria-hidden="true"
              />
              <span className="line-clamp-2">{value}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
