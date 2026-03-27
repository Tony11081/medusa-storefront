import { NextRequest, NextResponse } from "next/server"
import { siteContent } from "@lib/site-content"
import { createInflywayCheckout } from "@lib/server/inflyway"
import { rememberInflywayCheckout } from "@lib/server/medusa-checkout"
import { medusaServerFetch } from "@lib/server/medusa-server"

function formatAmount(total = 0) {
  return Number((total / 100).toFixed(2))
}

function buildCheckoutTitle(cart: {
  items?: Array<{ quantity?: number; title?: string }>
}) {
  const items = cart.items ?? []
  const firstTitle = items[0]?.title || `${siteContent.name} order`

  if (items.length <= 1) {
    return firstTitle
  }

  return `${firstTitle} + ${items.length - 1} more`
}

function buildCheckoutNote(orderRef: string, cartId: string, email?: string) {
  return [
    `${siteContent.name} order ${orderRef}`,
    `cartId=${cartId}`,
    email ? `Buyer: ${email}` : "",
  ]
    .filter(Boolean)
    .join(" | ")
}

function buildCheckoutRaw(
  orderRef: string,
  cartId: string,
  cart: {
    currency_code?: string
    items?: Array<{ quantity?: number; title?: string }>
    total?: number
  },
  checkout?: Record<string, unknown> | null
) {
  const items = (cart.items ?? [])
    .map((item) => `${item.title || "Item"} x${item.quantity || 1}`)
    .join(", ")

  const name = [checkout?.first_name, checkout?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()
  const address = [
    checkout?.address_1,
    checkout?.city,
    checkout?.postal_code,
    String(checkout?.country_code || "").toUpperCase(),
  ]
    .filter(Boolean)
    .join(", ")

  return [
    `Store: ${siteContent.name}`,
    `Order Ref: ${orderRef}`,
    `Cart ID: ${cartId}`,
    items ? `Items: ${items}` : "",
    name ? `Customer: ${name}` : "",
    checkout?.email ? `Email: ${checkout.email}` : "",
    address ? `Ship to: ${address}` : "",
    `Amount: ${formatAmount(cart.total)} ${(
      cart.currency_code || "USD"
    ).toUpperCase()}`,
  ]
    .filter(Boolean)
    .join("\n")
}

function normalizeProductKey(cart: any) {
  const firstItem = cart?.items?.[0]
  return (
    firstItem?.product_handle ||
    firstItem?.product?.handle ||
    firstItem?.variant?.product?.handle ||
    undefined
  )
}

export async function POST(request: NextRequest) {
  try {
    const { cartId, countryCode } = await request.json()

    if (!cartId) {
      return NextResponse.json({ message: "cartId is required" }, { status: 400 })
    }

    const cartResponse = await medusaServerFetch(`/store/carts/${cartId}`)
    let cart = cartResponse?.cart

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 })
    }

    if (!cart.items?.length) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 })
    }

    if (!cart.shipping_address || !cart.email) {
      return NextResponse.json(
        { message: "Shipping address and email are required before payment." },
        { status: 400 }
      )
    }

    if (!cart.shipping_methods?.length) {
      const shippingOptions = await medusaServerFetch(
        `/store/shipping-options?cart_id=${cartId}`
      )
      const optionId = shippingOptions?.shipping_options?.[0]?.id

      if (!optionId) {
        return NextResponse.json(
          { message: "No shipping option is available for this order." },
          { status: 400 }
        )
      }

      await medusaServerFetch(`/store/carts/${cartId}/shipping-methods`, {
        method: "POST",
        body: JSON.stringify({ option_id: optionId }),
      })

      cart = (await medusaServerFetch(`/store/carts/${cartId}`))?.cart
    }

    const total = cart?.total ?? 0

    if (!total) {
      return NextResponse.json(
        { message: "Cart total is empty after shipping update." },
        { status: 400 }
      )
    }

    const orderRef = cartId
    const checkoutCountryCode =
      String(countryCode || cart?.shipping_address?.country_code || "gb")
        .trim()
        .toLowerCase() || "gb"

    const payment = await createInflywayCheckout({
      amount: formatAmount(total),
      currency: cart?.currency_code || "USD",
      email: cart?.email || undefined,
      mobile: cart?.shipping_address?.phone || undefined,
      note: buildCheckoutNote(orderRef, cartId, cart?.email || undefined),
      orderRef,
      productKey: normalizeProductKey(cart),
      raw: buildCheckoutRaw(orderRef, cartId, cart, {
        ...cart?.shipping_address,
        email: cart?.email,
      }),
      shippingInfo: {
        ...cart?.shipping_address,
        email: cart?.email,
      },
      title: buildCheckoutTitle(cart),
      type: "default",
    })

    await rememberInflywayCheckout(cartId, {
      inflyway_order_id: payment.orderId,
      inflyway_order_ref: orderRef,
      inflyway_payment_status: "pending",
      inflyway_payment_url: payment.orderUrl,
    })

    const searchParams = new URLSearchParams({
      cartId,
      countryCode: checkoutCountryCode,
      orderId: payment.orderId,
      orderRef,
      paymentUrl: payment.orderUrl,
    })

    return NextResponse.json({
      payment: {
        amount: formatAmount(total),
        cartId,
        checkoutUrl: `/${checkoutCountryCode}/checkout/payment?${searchParams.toString()}`,
        currency: (cart?.currency_code || "USD").toUpperCase(),
        orderId: payment.orderId,
        orderRef,
        paymentUrl: payment.orderUrl,
        statusUrl: `/api/checkout/status?${searchParams.toString()}`,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    )
  }
}
