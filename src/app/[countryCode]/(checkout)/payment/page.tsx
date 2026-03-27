import PaymentStatus from "@modules/checkout/components/payment-status"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Secure Payment",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PaymentPage() {
  return (
    <div className="content-container">
      <PaymentStatus />
    </div>
  )
}
