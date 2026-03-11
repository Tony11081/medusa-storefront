"use client"

import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useId } from "react"

type QuantitySelectProps = {
  value: number
  onChange: (value: number) => void
  max: number
  disabled?: boolean
  compact?: boolean
}

export default function QuantitySelect({
  value,
  onChange,
  max,
  disabled,
  compact = false,
}: QuantitySelectProps) {
  const optionCount = Math.max(1, max)
  const selectId = useId()

  return (
    <div className={clx("flex flex-col gap-y-2", compact && "gap-y-1")}>
      {!compact && (
        <label htmlFor={selectId} className="text-sm">
          Quantity
        </label>
      )}
      <div
        className={clx(
          "relative flex items-center rounded-[999px] border border-black/10 bg-white text-sm text-black transition focus-within:border-black/40",
          compact ? "w-full min-w-[88px]" : "w-full",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <select
          id={selectId}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          disabled={disabled}
          aria-label="Quantity"
          className="h-10 w-full appearance-none rounded-[999px] bg-transparent px-4 pr-10 text-sm font-medium text-black outline-none"
          data-testid="product-quantity-select"
        >
          {Array.from({ length: optionCount }, (_, index) => index + 1).map((qty) => (
            <option key={qty} value={qty}>
              {qty}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-black/70">
          <ChevronUpDown />
        </span>
      </div>
    </div>
  )
}
