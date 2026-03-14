import Image from "next/image"

import { HttpTypes } from "@medusajs/types"

import { isExternalImageUrl, normalizeImageUrl } from "@lib/util/images"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { countryNames, siteContent } from "@lib/site-content"

type EditorialHomeProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const EditorialHome = ({ products, region }: EditorialHomeProps) => {
  const productMap = new Map(
    products
      .filter((product): product is HttpTypes.StoreProduct & { handle: string } =>
        Boolean(product.handle)
      )
      .map((product) => [product.handle, product])
  )

  const featuredProducts = siteContent.featureHandles
    .map((handle) => productMap.get(handle))
    .filter(Boolean) as HttpTypes.StoreProduct[]

  const heroLead = featuredProducts[0]
  const heroImage = normalizeImageUrl(heroLead?.thumbnail)
  const editorialLead = featuredProducts[1] ?? featuredProducts[0] ?? null
  const editorialImage = normalizeImageUrl(editorialLead?.thumbnail)
  const journalLead = featuredProducts[2] ?? heroLead ?? null
  const journalImage = normalizeImageUrl(journalLead?.thumbnail)

  return (
    <div className="pb-20 md:pb-32">
      <section className="content-container pt-4 md:pt-8">
        <div className="editorial-frame min-h-[68vh] bg-[var(--brand-ink)] text-white sm:min-h-[72vh] md:min-h-[78vh]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={heroLead?.title ?? siteContent.name}
              fill
              priority
              unoptimized={isExternalImageUrl(heroImage)}
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,17,15,0.9),rgba(12,17,15,0.2)_48%,rgba(12,17,15,0.72))]" />
          <div className="relative grid min-h-[68vh] items-end gap-8 px-5 py-6 sm:min-h-[72vh] md:min-h-[78vh] md:px-10 md:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="max-w-3xl">
              <p className="eyebrow !text-white/70">{siteContent.eyebrow}</p>
              <h1 className="mt-4 font-display text-[3.35rem] leading-[0.9] tracking-[-0.06em] text-white sm:text-6xl md:mt-5 md:text-8xl">
                Designer fabrics by the yard, chosen for interiors and custom work.
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/76 md:mt-6 md:text-lg md:leading-8">
                Browse jacquard, leather, vinyl, and specialty linings with
                clear pricing, project notes, and support before larger orders.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
                <LocalizedClientLink href="/store" className="brand-button">
                  Shop the archive
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/guide"
                  className="brand-button brand-button-secondary !border-white/30 !text-white hover:!bg-white/8"
                >
                  Shipping & sourcing guide
                </LocalizedClientLink>
              </div>
            </div>

            <div className="grid gap-3 self-end sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
              <HeroNote
                title="Sold by the yard"
                body="Every product is priced in clear 1 yard units so you can plan projects faster."
              />
              <HeroNote
                title="Project guidance"
                body="Ask for texture checks, swatch help, or sourcing guidance before larger orders."
              />
              <HeroNote
                title="Interior-focused"
                body="Selected for upholstery, panels, soft goods, trims, and custom fabrication work."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="content-container py-12 md:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {siteContent.valueProps.map((item) => (
            <article
              key={item.title}
              className="editorial-surface rounded-[2px] px-5 py-6 md:px-6"
            >
              <p className="eyebrow">{item.title}</p>
              <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-container py-6 md:py-10">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:gap-8">
          <article className="editorial-frame min-h-[26rem] bg-[var(--brand-panel-strong)] md:min-h-[32rem]">
            {editorialImage ? (
              <Image
                src={editorialImage}
                alt={editorialLead?.title ?? "Editorial feature"}
                fill
                unoptimized={isExternalImageUrl(editorialImage)}
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,21,18,0.06),rgba(16,21,18,0.72))]" />
            <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
              <p className="eyebrow !text-white/72">Editorialized collection feature</p>
              <h2 className="mt-4 max-w-xl font-display text-[2.8rem] leading-[0.94] tracking-[-0.05em] text-white md:text-6xl">
                Start with the material family that fits the room or project.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-white/74">
                Move from jacquard to leather to vinyl without losing the finish,
                scale, or sourcing context that helps you choose well.
              </p>
              <div className="mt-6">
                <LocalizedClientLink
                  href={editorialLead?.handle ? `/products/${editorialLead.handle}` : "/store"}
                  className="brand-link !text-white !decoration-white/30"
                >
                  Shop this feature
                </LocalizedClientLink>
              </div>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2 md:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductPreview key={product.id} product={product} region={region} />
            ))}
          </div>
        </div>
      </section>

      <section className="content-container py-12 md:py-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Best sellers rail</p>
            <h2 className="mt-4 font-display text-[2.5rem] leading-[0.96] tracking-[-0.04em] text-[var(--brand-ink)] md:text-5xl">
              Most requested materials, ready to compare on one pass.
            </h2>
          </div>
          <LocalizedClientLink href="/store" className="brand-link">
            Browse all materials
          </LocalizedClientLink>
        </div>
        <div className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
          <div className="flex min-w-max gap-5 pb-2">
            {featuredProducts.concat(featuredProducts).slice(0, 8).map((product, index) => (
              <div key={`${product.id}-${index}`} className="w-[15.25rem] shrink-0 md:w-[22rem]">
                <ProductPreview product={product} region={region} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-container py-8 md:py-12">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:gap-8">
          <article className="editorial-surface rounded-[2px] px-6 py-8 md:px-8 md:py-10">
            <p className="eyebrow">The journal</p>
            <h2 className="mt-4 max-w-3xl font-display text-[2.5rem] leading-[0.97] tracking-[-0.05em] text-[var(--brand-ink)] md:text-6xl">
              Buying designer fabric online works better when the practical details stay close.
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-[0.72fr_1.28fr] md:gap-8">
              <div className="space-y-6 border-l border-[var(--brand-line)] pl-5">
                <p className="text-[1.7rem] leading-[1.25] text-[var(--brand-muted)] md:text-[2rem]">
                  “Texture, scale, and order quantity should be easy to judge on a phone.”
                </p>
                <p className="soft-caption">Buying principle</p>
              </div>
              <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
                <p>{siteContent.about.lead}</p>
                {siteContent.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <LocalizedClientLink href="/about" className="brand-link">
                  Read the brand story
                </LocalizedClientLink>
              </div>
            </div>
          </article>

          <article className="editorial-frame min-h-[24rem] bg-[var(--brand-panel-strong)] md:min-h-[30rem]">
            {journalImage ? (
              <Image
                src={journalImage}
                alt={journalLead?.title ?? "Journal feature"}
                fill
                unoptimized={isExternalImageUrl(journalImage)}
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,17,15,0.05),rgba(12,17,15,0.78))]" />
            <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
              <div className="max-w-xs rounded-[2px] border border-white/18 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">
                  Material spotlight
                </p>
                <p className="mt-2 text-sm leading-7 text-white/76">
                  {journalLead?.origin_country
                    ? `Origin ${countryNames[journalLead.origin_country] ?? journalLead.origin_country.toUpperCase()}`
                    : "Selected for a stronger tactile point of view"}
                </p>
              </div>
              <div>
                <p className="eyebrow !text-white/72">Behind the design</p>
                <h3 className="mt-4 max-w-lg font-display text-[2.35rem] leading-[0.98] tracking-[-0.05em] text-white md:text-5xl">
                  Clear imagery and practical notes make it easier to commit to the right yardage.
                </h3>
                <p className="mt-4 max-w-lg text-base leading-8 text-white/72">
                  Use the archive to compare finish, pattern, and use case before
                  moving into product detail pages and checkout.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="content-container pt-12 md:pt-20">
        <div className="editorial-surface rounded-[2px] px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">Footer signup block</p>
              <h2 className="mt-4 font-display text-[2.45rem] leading-[0.98] tracking-[-0.05em] text-[var(--brand-ink)] md:text-5xl">
                Need help before ordering yardage for a larger project?
              </h2>
              <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">
                Contact the studio for sourcing questions, swatch guidance, and
                help narrowing the right material family.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${siteContent.supportEmail}`} className="brand-button">
                Email the studio
              </a>
              <LocalizedClientLink href="/guide" className="brand-button brand-button-secondary">
                Read the guide
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[2px] border border-white/12 bg-white/8 px-5 py-5 backdrop-blur-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/60">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/76">{body}</p>
    </div>
  )
}

export default EditorialHome
