"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-5">
      <Heading level="h2" className="font-display text-[2rem] leading-[1] tracking-[-0.04em] text-[var(--brand-ink)] md:text-[2.2rem]">
        Order summary
      </Heading>
      <p className="text-sm leading-7 text-[var(--brand-muted)]">
        Yardage, shipping, and final total are shown here before you continue to
        checkout.
      </p>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="brand-button !flex !w-full !rounded-[2px] !px-5 !py-4 !text-[11px] !tracking-[0.26em]">
          Go to checkout
        </Button>
      </LocalizedClientLink>
      <div className="rounded-[2px] border border-[var(--brand-line)] bg-[rgba(252,251,248,0.78)] px-4 py-4 text-sm leading-7 text-[var(--brand-muted)]">
        Secure checkout. Shipping and taxes are finalized in the next steps. If
        you need help before placing a larger order, contact
        {" "}
        <a href="mailto:support@upholsteryfabric.net" className="brand-link">
          support@upholsteryfabric.net
        </a>
        .
      </div>
    </div>
  )
}

export default Summary
