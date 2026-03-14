import { Label, RadioGroup, Text, clx } from "@medusajs/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Text className="soft-caption text-[var(--brand-soft)]">{title}</Text>
      <RadioGroup
        data-testid={dataTestId}
        onValueChange={handleChange}
        className="-mx-1 flex min-w-full gap-2 overflow-x-auto px-1 pb-1 no-scrollbar md:mx-0 md:min-w-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0"
      >
        {items?.map((i) => (
          <div
            key={i.value}
            className="flex items-center"
          >
            <RadioGroup.Item
              checked={i.value === value}
              className="hidden peer"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                "cursor-pointer rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition",
                {
                  "border-[var(--brand-ink)] bg-[var(--brand-ink)] text-[var(--brand-paper)]":
                    i.value === value,
                  "border-[var(--brand-line-strong)] bg-[rgba(252,251,248,0.7)] text-[var(--brand-soft)] hover:border-[var(--brand-ink)] hover:text-[var(--brand-ink)]":
                    i.value !== value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
