const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function medusaServerFetch(path: string, init?: RequestInit) {
  const response = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    throw new Error(data?.message || `Medusa request failed: ${response.status}`)
  }

  return data
}
