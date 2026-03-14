import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div>
      <div className="flex items-center pb-3">
        <Heading className="font-display text-[2.35rem] leading-[1] tracking-[-0.04em] text-[var(--brand-ink)] md:text-[3.5rem]">
          Your cart
        </Heading>
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--brand-muted)] md:mt-4 md:text-base md:leading-8">
        A premium cart should reduce hesitation: clear product details,
        comfortable mobile controls, and a summary that never competes with the
        next action.
      </p>
      <div className="mt-8 grid gap-4">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
          : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </div>
    </div>
  )
}

export default ItemsTemplate
