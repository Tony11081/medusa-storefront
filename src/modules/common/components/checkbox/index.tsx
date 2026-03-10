import { Checkbox, Label } from "@medusajs/ui"
import React, { useId } from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  id?: string
  name?: string
  'data-testid'?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  id,
  name,
  'data-testid': dataTestId
}) => {
  const generatedId = useId()
  const controlId = id ?? name ?? generatedId
  const labelId = `${controlId}-label`

  return (
    <div className="flex items-center space-x-2 ">
      <Checkbox
        className="text-base-regular flex items-center gap-x-2"
        id={controlId}
        role="checkbox"
        type="button"
        checked={checked}
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={onChange}
        name={name}
        data-testid={dataTestId}
      />
      <Label
        id={labelId}
        htmlFor={controlId}
        className="!transform-none !txt-medium"
        size="large"
      >
        {label}
      </Label>
    </div>
  )
}

export default CheckboxWithLabel
