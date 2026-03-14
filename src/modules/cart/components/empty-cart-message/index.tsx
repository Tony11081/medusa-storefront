import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="editorial-surface rounded-[2px] px-5 py-12 md:px-8 md:py-16"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row items-baseline gap-x-2 font-display text-5xl leading-none tracking-[-0.05em] text-[var(--brand-ink)]"
      >
        Your cart is still empty.
      </Heading>
      <Text className="mb-6 mt-4 max-w-[32rem] text-base leading-8 text-[var(--brand-muted)]">
        Start with the archive, compare material families, and add the yardage
        you need once the project direction feels right.
      </Text>
      <div>
        <InteractiveLink href="/store">Explore products</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
