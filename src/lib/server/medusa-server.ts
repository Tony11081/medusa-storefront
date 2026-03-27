const DEFAULT_MEDUSA_BACKEND_URL =
  "http://medusa-store-ga7di9-4e3642-23-94-38-181.traefik.me"

const DEFAULT_PUBLISHABLE_KEY =
  "pk_079ca2c1a2c0f9aeb9dc66a1df6a6d165676dc3fdccc2c62c8749499a86d4b3c"

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  DEFAULT_MEDUSA_BACKEND_URL

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || DEFAULT_PUBLISHABLE_KEY

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
