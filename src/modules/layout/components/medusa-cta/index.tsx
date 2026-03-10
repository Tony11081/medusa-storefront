import { Text } from "@medusajs/ui"
import { siteContent } from "@lib/site-content"

const MedusaCTA = () => {
  return (
    <Text className="txt-compact-small-plus uppercase tracking-[0.18em] text-[var(--brand-soft)]">
      {siteContent.tagline}
    </Text>
  )
}

export default MedusaCTA
