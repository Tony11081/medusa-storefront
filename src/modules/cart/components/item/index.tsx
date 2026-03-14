"use client"

import { Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import QuantitySelect from "@modules/products/components/product-actions/quantity-select"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  if (type === "preview") {
    return (
      <div className="grid grid-cols-[4.5rem_1fr] gap-4" data-testid="product-row">
        <LocalizedClientLink href={`/products/${item.product_handle}`} className="block">
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <Text className="line-clamp-2 text-sm text-[var(--brand-ink)]" data-testid="product-title">
              {item.product_title}
            </Text>
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
            <span className="mt-2 flex gap-x-1 text-sm text-[var(--brand-soft)]">
              <Text className="text-[var(--brand-soft)]">{item.quantity}x</Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          </div>
          <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
        </div>
      </div>
    )
  }

  return (
    <article
      className="grid grid-cols-[5.75rem_1fr] gap-4 rounded-[2px] border border-[var(--brand-line)] bg-[rgba(252,251,248,0.82)] p-4 md:grid-cols-[8rem_1fr_auto] md:gap-5"
      data-testid="product-row"
    >
      <LocalizedClientLink href={`/products/${item.product_handle}`} className="block">
        <Thumbnail
          thumbnail={item.thumbnail}
          images={item.variant?.product?.images}
          size="square"
          className="w-full"
        />
      </LocalizedClientLink>

      <div className="min-w-0">
        <Text className="text-base text-[var(--brand-ink)] md:text-lg" data-testid="product-title">
          {item.product_title}
        </Text>
        <div className="mt-2 text-sm text-[var(--brand-muted)]">
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--brand-muted)]">
          <div>
            <span className="soft-caption">Unit price</span>
            <div className="mt-1">
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>
          <DeleteButton
            id={item.id}
            className="brand-link !text-[11px] !tracking-[0.22em]"
            data-testid="product-delete-button"
          >
            Remove
          </DeleteButton>
          {updating && <Spinner />}
        </div>
        <div className="mt-4 max-w-full md:max-w-[12rem]">
          <QuantitySelect
            value={item.quantity}
            onChange={changeQuantity}
            max={Math.min(maxQuantity, 10)}
            disabled={updating}
          />
        </div>
        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>

      <div className="col-span-full flex items-start justify-between gap-4 border-t border-[var(--brand-line)] pt-3 md:col-auto md:border-t-0 md:pt-0 md:flex-col md:items-end">
        <div>
          <p className="soft-caption">Line total</p>
          <div className="mt-2 text-lg text-[var(--brand-ink)]">
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default Item
