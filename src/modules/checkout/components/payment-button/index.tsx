"use client"

import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { usePathname, useRouter } from "next/navigation"
import React, { useRef, useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const CHECKOUT_SESSION_KEY = "atelier-inflyway-payment-session"

const renderPaymentWindowShell = (paymentWindow: Window | null) => {
  if (!paymentWindow) {
    return
  }

  try {
    paymentWindow.document.title = "Connecting to secure payment..."
    paymentWindow.document.body.innerHTML = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 32px; color: #222; line-height: 1.6;">
        <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #5f645c; margin: 0 0 12px;">Atelier Fabrics</p>
        <h1 style="font-size: 28px; line-height: 1.05; margin: 0 0 16px;">Connecting you to secure payment…</h1>
        <p style="margin: 0;">If your payment window does not continue automatically, return to the checkout page and use the secure payment button there.</p>
      </div>
    `
  } catch {
    // Ignore cross-window DOM access failures and fall back to the checkout page CTA.
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <InflywayPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const orderInFlightRef = useRef(false)

  const onPaymentCompleted = async () => {
    if (orderInFlightRef.current) {
      return
    }

    orderInFlightRef.current = true
    setErrorMessage(null)

    const result = await placeOrder().finally(() => {
      orderInFlightRef.current = false
      setSubmitting(false)
    })

    if (result?.type === "error") {
      setErrorMessage(result.message)
    }
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    if (submitting || orderInFlightRef.current) {
      return
    }

    setErrorMessage(null)
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady || submitting}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const InflywayPaymentButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const orderInFlightRef = useRef(false)
  const pathname = usePathname()
  const router = useRouter()

  const handlePayment = async () => {
    if (submitting || orderInFlightRef.current) {
      return
    }

    setSubmitting(true)
    setErrorMessage(null)
    orderInFlightRef.current = true

    const countryCode =
      pathname.split("/").filter(Boolean)[0] ||
      cart.shipping_address?.country_code ||
      "gb"
    const paymentWindow = window.open("", "_blank")
    renderPaymentWindowShell(paymentWindow)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: cart.id,
          countryCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "We couldn't create your payment link.")
      }

      if (!data?.payment?.paymentUrl || !data?.payment?.checkoutUrl) {
        throw new Error("We couldn't create your payment link.")
      }

      sessionStorage.setItem(
        CHECKOUT_SESSION_KEY,
        JSON.stringify({
          orderId: data.payment.orderId,
          orderRef: data.payment.orderRef,
          paymentUrl: data.payment.paymentUrl,
        })
      )

      if (paymentWindow) {
        try {
          paymentWindow.location.replace(data.payment.paymentUrl)
          paymentWindow.focus()
        } catch {
          window.open(data.payment.paymentUrl, "_blank", "noopener,noreferrer")
        }
      }

      router.push(data.payment.checkoutUrl)
    } catch (error) {
      paymentWindow?.close()
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't create your payment link."
      )
    } finally {
      orderInFlightRef.current = false
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady || submitting}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Continue to secure payment
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
