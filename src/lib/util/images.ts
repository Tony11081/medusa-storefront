const CANONICAL_HOSTS: Record<string, string> = {
  "www.wouwww.com": "wouwww.com",
}

export function normalizeImageUrl(input?: string | null): string | undefined {
  const trimmed = input?.trim()

  if (!trimmed) {
    return undefined
  }

  try {
    const url = new URL(trimmed)

    if (url.hostname in CANONICAL_HOSTS) {
      url.hostname = CANONICAL_HOSTS[url.hostname]
    }

    if (url.protocol === "http:" && url.hostname === "wouwww.com") {
      url.protocol = "https:"
    }

    return url.toString()
  } catch {
    return trimmed
  }
}

export function isExternalImageUrl(input?: string | null): boolean {
  return Boolean(input && /^https?:\/\//i.test(input))
}
