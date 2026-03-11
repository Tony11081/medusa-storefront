"use client"

import { clx } from "@medusajs/ui"

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

  return (
    <div className={clx("flex flex-col gap-y-2", compact && "gap-y-1")}>
      {!compact && <span className="text-sm">Quantity</span>}
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        className={clx(
          "h-10 rounded-[999px] border border-black/10 bg-white px-4 text-sm text-black outline-none transition focus:border-black/40",
          compact ? "w-full min-w-[88px]" : "w-full"
        )}
        data-testid="product-quantity-select"
      >
        {Array.from({ length: optionCount }, (_, index) => index + 1).map((qty) => (
          <option key={qty} value={qty}>
            {qty}
          </option>
        ))}
      </select>
    </div>
  )
}
