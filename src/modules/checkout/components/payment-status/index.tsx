"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"

const CHECKOUT_SESSION_KEY = "atelier-inflyway-payment-session"

type CheckoutSession = {
  orderId?: string
  orderRef?: string
  paymentUrl?: string
}

type CheckoutStatusResponse = {
  cartId?: string | null
  confirmedUrl?: string | null
  found: boolean
  medusaSync?: {
    alreadyCompleted?: boolean
    displayId?: number | null
    error?: string
    orderId?: string | null
    ok: boolean
  } | null
  paid: boolean
  paymentUrl?: string | null
  status: "paid" | "pending"
  order?: {
    amount?: number | string | null
    createdAt?: string | null
    currency?: string | null
    orderId?: string | null
    orderNumber?: string | null
    orderRef?: string | null
    paymentStatus?: string | null
  }
}

function formatAmount(amount?: number | string | null, currency = "USD") {
  const rawAmount = typeof amount === "string" ? Number(amount) : amount
  if (typeof rawAmount !== "number" || Number.isNaN(rawAmount)) return null

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(rawAmount)
}

function getStoredSession(orderId: string, orderRef: string) {
  const raw = sessionStorage.getItem(CHECKOUT_SESSION_KEY)
  if (!raw) return null

  try {
    const session = JSON.parse(raw) as CheckoutSession
    if (!session.orderId && !session.orderRef) return null
    if (orderId && session.orderId && session.orderId !== orderId) return null
    if (orderRef && session.orderRef && session.orderRef !== orderRef) return null
    return session
  } catch {
    return null
  }
}

function PaymentStatusContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const countryCode = pathname.split("/").filter(Boolean)[0] || "gb"
  const cartId = searchParams.get("cartId") || ""
  const orderId = searchParams.get("orderId") || ""
  const orderRef = searchParams.get("orderRef") || ""
  const paymentUrlParam = searchParams.get("paymentUrl") || ""

  const [paymentUrl, setPaymentUrl] = useState(paymentUrlParam)
  const [status, setStatus] = useState<CheckoutStatusResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null)

  useEffect(() => {
    setPaymentUrl(paymentUrlParam)
    setStatus(null)
    setError(null)
    setLoading(true)
    setLastCheckedAt(null)
  }, [cartId, orderId, orderRef, paymentUrlParam])

  useEffect(() => {
    const storedSession = getStoredSession(orderId, orderRef)
    if (storedSession?.paymentUrl) {
      setPaymentUrl((current) => current || storedSession.paymentUrl || "")
    }
  }, [orderId, orderRef])

  const statusQuery = useMemo(() => {
    if (!orderId && !orderRef) return ""

    const params = new URLSearchParams()
    if (cartId) params.set("cartId", cartId)
    if (orderId) params.set("orderId", orderId)
    if (orderRef) params.set("orderRef", orderRef)
    if (paymentUrl) params.set("paymentUrl", paymentUrl)
    params.set("countryCode", countryCode)
    return params.toString()
  }, [cartId, countryCode, orderId, orderRef, paymentUrl])

  const isPaid = status?.paid ?? false
  const amountLabel = formatAmount(
    status?.order?.amount,
    status?.order?.currency || "USD"
  )

  const loadStatus = useCallback(async () => {
    if (!statusQuery) return

    const response = await fetch(`/api/checkout/status?${statusQuery}`, {
      cache: "no-store",
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || "Could not load payment status")
    }

    const checkoutStatus = data as CheckoutStatusResponse
    setStatus(checkoutStatus)
    setError(null)
    setLastCheckedAt(new Date().toISOString())

    if (checkoutStatus.paymentUrl) {
      setPaymentUrl((current) => current || checkoutStatus.paymentUrl || "")
    }

    if (checkoutStatus.paid && checkoutStatus.confirmedUrl) {
      sessionStorage.removeItem(CHECKOUT_SESSION_KEY)
      router.replace(checkoutStatus.confirmedUrl)
    }
  }, [router, statusQuery])

  useEffect(() => {
    if (!statusQuery) {
      setLoading(false)
      return
    }

    let active = true

    const run = async () => {
      try {
        await loadStatus()
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load payment status"
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    run()

    if (isPaid) {
      return () => {
        active = false
      }
    }

    const interval = window.setInterval(run, 5000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [isPaid, loadStatus, statusQuery])

  if (!orderId && !orderRef) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-5 py-12">
        <div className="rounded-[28px] border border-[var(--brand-line)] bg-white p-8">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--brand-soft)]">
            Payment status
          </div>
          <Heading className="font-display mt-4 text-4xl text-[var(--brand-ink)]">
            We could not find an active payment session.
          </Heading>
          <Text className="mt-4 text-sm leading-7 text-[var(--brand-soft)]">
            Return to your cart and start checkout again. We will generate a
            secure Inflyway payment link from there.
          </Text>
          <LocalizedClientLink
            href="/cart"
            className="mt-8 inline-flex rounded-[2px] border border-[var(--brand-ink)] px-5 py-3 text-sm font-medium text-[var(--brand-ink)]"
          >
            Return to cart
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[32px] border border-[var(--brand-line)] bg-white p-8 shadow-[0_28px_70px_rgba(34,34,34,0.06)] md:p-10">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--brand-soft)]">
          Secure payment
        </div>
        <Heading className="font-display mt-4 text-5xl leading-[0.94] text-[var(--brand-ink)] md:text-6xl">
          {isPaid
            ? "Payment confirmed."
            : "Complete your order in the secure Inflyway window."}
        </Heading>
        <Text className="mt-5 max-w-2xl text-sm leading-7 text-[var(--brand-soft)] md:text-base">
          {isPaid
            ? "Your payment has been received. We are syncing the order into your Atelier Fabrics account now."
            : "Your yardage, address, and shipping details are already attached to this order. Keep this page open while we watch for payment confirmation."}
        </Text>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[var(--brand-line)] bg-[var(--brand-paper)] p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-soft)]">
              Order ref
            </div>
            <div className="mt-3 text-sm font-semibold text-[var(--brand-ink)]">
              {status?.order?.orderRef || orderRef}
            </div>
          </div>
          <div className="rounded-[24px] border border-[var(--brand-line)] bg-[var(--brand-paper)] p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-soft)]">
              Payment status
            </div>
            <div className="mt-3 text-sm font-semibold text-[var(--brand-ink)]">
              {loading
                ? "Checking..."
                : status?.found === false
                  ? "Registering order"
                  : status?.order?.paymentStatus || (isPaid ? "PAID" : "PENDING")}
            </div>
          </div>
          <div className="rounded-[24px] border border-[var(--brand-line)] bg-[var(--brand-paper)] p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-soft)]">
              Payment order
            </div>
            <div className="mt-3 text-sm font-semibold text-[var(--brand-ink)]">
              {status?.order?.orderId || orderId}
            </div>
          </div>
          <div className="rounded-[24px] border border-[var(--brand-line)] bg-[var(--brand-paper)] p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-soft)]">
              Amount
            </div>
            <div className="mt-3 text-sm font-semibold text-[var(--brand-ink)]">
              {amountLabel || "Pending"}
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-[18px] border border-[rgba(156,66,57,0.28)] bg-[rgba(156,66,57,0.06)] px-4 py-3 text-sm text-[rgb(126,46,38)]">
            {error}
          </div>
        ) : null}

        {status?.medusaSync?.ok === false ? (
          <div className="mt-6 rounded-[18px] border border-[rgba(156,66,57,0.28)] bg-[rgba(156,66,57,0.06)] px-4 py-3 text-sm text-[rgb(126,46,38)]">
            Payment is recorded, but the order confirmation is still syncing.
            Please keep this page open for another moment.
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {paymentUrl ? (
            <Button
              asChild
              className="h-12 rounded-[2px] bg-[var(--brand-accent)] px-6 text-sm font-medium text-white hover:bg-[var(--brand-accent-strong)]"
            >
              <a href={paymentUrl} target="_blank" rel="noreferrer">
                Open secure payment page
              </a>
            </Button>
          ) : null}
          <LocalizedClientLink
            href="/cart"
            className="inline-flex h-12 items-center justify-center rounded-[2px] border border-[var(--brand-ink)] px-6 text-sm font-medium text-[var(--brand-ink)]"
          >
            Back to cart
          </LocalizedClientLink>
        </div>
      </section>

      <aside className="rounded-[32px] border border-[var(--brand-line)] bg-[var(--brand-paper)] p-8 md:p-10">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--brand-soft)]">
          What happens next
        </div>
        <div className="mt-5 space-y-5 text-sm leading-7 text-[var(--brand-soft)]">
          <p>
            1. We open a secure Inflyway payment window for the order you just
            prepared.
          </p>
          <p>
            2. This page keeps checking for confirmation so we can send you back
            into Atelier Fabrics automatically.
          </p>
          <p>
            3. Once payment clears, we sync the order into your account and
            route you to the order confirmation page.
          </p>
        </div>
        {lastCheckedAt ? (
          <Text className="mt-8 text-xs uppercase tracking-[0.18em] text-[var(--brand-soft)]">
            Last checked {new Date(lastCheckedAt).toLocaleTimeString()}
          </Text>
        ) : null}
      </aside>
    </div>
  )
}

export default function PaymentStatus() {
  return (
    <Suspense fallback={<div className="py-12" />}>
      <PaymentStatusContent />
    </Suspense>
  )
}
