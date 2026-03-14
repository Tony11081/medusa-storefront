import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import QuantitySelect from "./quantity-select"
import { HttpTypes } from "@medusajs/types"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  visibleOptions: HttpTypes.StoreProductOption[]
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  quantity: number
  updateQuantity: (value: number) => void
  maxQuantity: number
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  visibleOptions,
  options,
  updateOptions,
  quantity,
  updateQuantity,
  maxQuantity,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const hasVisibleOptions = visibleOptions.length > 0
  const selectedOptionsLabel = visibleOptions
    .map((option) => options[option.id])
    .filter(Boolean)
    .join(" / ")

  return (
    <>
      <div
        className={clx("fixed inset-x-0 bottom-0 z-50 lg:hidden", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-y-2 border-t border-[var(--brand-line)] bg-[rgba(252,251,248,0.96)] px-4 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-3 backdrop-blur-xl"
            data-testid="mobile-actions"
          >
            <div className="flex w-full items-center gap-x-2 text-sm text-[var(--brand-muted)]">
              <span className="line-clamp-1" data-testid="mobile-title">
                {product.title}
              </span>
              <span>—</span>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2 text-[var(--brand-ink)]">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-small-regular">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx({
                      "text-ui-fg-interactive":
                        selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div
              className={clx("grid w-full gap-x-3", {
                "grid-cols-3": hasVisibleOptions,
                "grid-cols-2": !hasVisibleOptions,
              })}
            >
              {hasVisibleOptions && (
                <Button
                  onClick={open}
                  variant="secondary"
                  className="!min-h-12 !rounded-[2px] !border-[var(--brand-line-strong)] !bg-[rgba(252,251,248,0.88)] !px-3 !text-[11px] !uppercase !tracking-[0.16em] !text-[var(--brand-ink)]"
                  data-testid="mobile-actions-button"
                >
                  <div className="flex w-full items-center justify-between">
                    <span>{selectedOptionsLabel || "Select options"}</span>
                    <ChevronDown />
                  </div>
                </Button>
              )}
              <QuantitySelect
                value={quantity}
                onChange={updateQuantity}
                max={maxQuantity}
                disabled={optionsDisabled}
                compact
              />
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !variant}
                className="brand-button !w-full !rounded-[2px] !px-4 !text-[11px] !tracking-[0.2em]"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!variant
                  ? "Select variant"
                  : !inStock
                  ? "Out of stock"
                  : "Add to cart"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[rgba(18,22,20,0.55)] backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-x-0 bottom-0">
            <div className="flex min-h-full h-full items-end justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-y-6 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="ease-in duration-200"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-6 opacity-0"
              >
                <Dialog.Panel
                  className="flex w-full max-w-none transform flex-col gap-y-4 overflow-hidden rounded-t-[1.6rem] border border-white/10 bg-[var(--brand-panel)] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 text-left shadow-[0_-28px_70px_rgba(18,22,20,0.28)]"
                  data-testid="mobile-actions-modal"
                >
                  <div className="flex w-full justify-end">
                    <button
                      onClick={close}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brand-line)] bg-white text-ui-fg-base"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto pb-2">
                    {(product.variants?.length ?? 0) > 1 && hasVisibleOptions && (
                      <div className="flex flex-col gap-y-6">
                        {visibleOptions.map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                product={product}
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
