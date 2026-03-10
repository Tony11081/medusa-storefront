export const getBaseURL = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_DOMAIN ||
    process.env.VERCEL_URL

  if (!baseUrl) {
    return "http://localhost:8000"
  }

  if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
    return baseUrl
  }

  return `https://${baseUrl}`
}
