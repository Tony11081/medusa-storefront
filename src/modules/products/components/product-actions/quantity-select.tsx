"use client"

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
  const maxQuantity = Math.max(1, max)
  const canDecrease = !disabled && value > 1
  const canIncrease = !disabled && value < maxQuantity
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
          "grid min-h-12 grid-cols-[44px_1fr_44px] items-center overflow-hidden rounded-[2px] border border-[var(--brand-line-strong)] bg-[rgba(252,251,248,0.88)] text-sm text-[var(--brand-ink)] transition",
          compact ? "w-full min-w-[88px]" : "w-full",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <button
          type="button"
          onClick={() => canDecrease && onChange(value - 1)}
          disabled={!canDecrease}
          aria-label="Decrease quantity"
          className="flex h-full items-center justify-center border-r border-[var(--brand-line)] text-lg text-[var(--brand-ink)] transition hover:bg-[rgba(32,37,33,0.04)] disabled:cursor-not-allowed disabled:text-black/25 disabled:hover:bg-transparent"
        >
          -
        </button>
        <div
          id={selectId}
          aria-label="Quantity"
          aria-live="polite"
          className="flex h-full items-center justify-center text-sm font-medium text-[var(--brand-ink)]"
          data-testid="product-quantity-select"
        >
          {value}
        </div>
        <button
          type="button"
          onClick={() => canIncrease && onChange(value + 1)}
          disabled={!canIncrease}
          aria-label="Increase quantity"
          className="flex h-full items-center justify-center border-l border-[var(--brand-line)] text-lg text-[var(--brand-ink)] transition hover:bg-[rgba(32,37,33,0.04)] disabled:cursor-not-allowed disabled:text-black/25 disabled:hover:bg-transparent"
        >
          +
        </button>
      </div>
    </div>
  )
}
