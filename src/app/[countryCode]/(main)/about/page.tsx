import { Metadata } from "next"
import Image from "next/image"

import { listAllProducts } from "@lib/data/products"
import { isExternalImageUrl, normalizeImageUrl } from "@lib/util/images"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { siteContent } from "@lib/site-content"
import { absoluteUrl } from "@lib/util/seo"

type AboutProps = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: AboutProps): Promise<Metadata> {
  const { countryCode } = await props.params

  return {
    title: `About ${siteContent.name}`,
    description: siteContent.description,
    alternates: {
      canonical: absoluteUrl(`/${countryCode}/about`),
    },
    openGraph: {
      title: `About ${siteContent.name}`,
      description: siteContent.description,
      url: absoluteUrl(`/${countryCode}/about`),
    },
  }
}

export default async function AboutPage(props: AboutProps) {
  const { countryCode } = await props.params
  const products = await listAllProducts({
    countryCode,
    queryParams: {
      limit: 100,
    },
  }).catch(() => [])

  const featuredMap = new Map(
    products
      .filter((product) => product.handle)
      .map((product) => [product.handle as string, product])
  )

  const featuredProducts = siteContent.featureHandles
    .map((handle) => featuredMap.get(handle))
    .filter(Boolean)

  const heroImage = normalizeImageUrl(featuredProducts[0]?.thumbnail)
  const portraitImage = normalizeImageUrl(featuredProducts[1]?.thumbnail)
  const diptychLeft = normalizeImageUrl(featuredProducts[2]?.thumbnail)
  const diptychRight = normalizeImageUrl(featuredProducts[3]?.thumbnail)

  return (
    <div className="content-container py-6 md:py-16">
      <section className="editorial-frame overflow-hidden bg-[var(--brand-ink)] text-white">
        <div className="relative min-h-[32rem] md:min-h-[42rem]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={`About ${siteContent.name}`}
              fill
              priority
              unoptimized={isExternalImageUrl(heroImage)}
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(12,17,15,0.88),rgba(12,17,15,0.28)_50%,rgba(12,17,15,0.76))]" />
          <div className="relative grid min-h-[32rem] gap-10 px-6 py-8 md:min-h-[42rem] md:px-10 md:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="self-start">
              <p className="eyebrow !text-white/68">{siteContent.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl font-display text-[3.25rem] leading-[0.9] tracking-[-0.06em] text-white md:text-7xl">
                Sourcing designer materials with more clarity and less marketplace noise.
              </h1>
            </div>
            <div className="max-w-xl self-end rounded-[2px] border border-white/15 bg-white/10 px-5 py-5 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/68">
                Brand point of view
              </p>
              <p className="mt-4 text-base leading-8 text-white/78">
                {siteContent.about.lead}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-3xl">
        <div className="space-y-6 text-[1.05rem] leading-9 text-[var(--brand-muted)]">
          {siteContent.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <article className="editorial-frame min-h-[26rem] bg-[var(--brand-panel-strong)] md:min-h-[34rem]">
          {portraitImage ? (
            <Image
              src={portraitImage}
              alt={`${siteContent.name} editorial image`}
              fill
              unoptimized={isExternalImageUrl(portraitImage)}
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,17,15,0.06),rgba(12,17,15,0.78))]" />
          <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
            <p className="eyebrow !text-white/70">Studio note</p>
            <p className="mt-4 max-w-sm font-display text-[2.3rem] leading-[0.98] tracking-[-0.05em] text-white md:text-5xl">
              Texture, scale, and use matter more when the details stay easy to read.
            </p>
          </div>
        </article>

        <article className="editorial-surface rounded-[2px] px-6 py-8 md:px-8 md:py-10">
          <p className="eyebrow">Why this storefront exists</p>
          <div className="mt-6 space-y-6 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              We built {siteContent.name} to feel closer to a focused sourcing
              room: quieter, more selective, and easier to trust when you are
              buying by the yard.
            </p>
            <p>
              Instead of crowding the screen with marketplace noise, the archive
              leaves room for scale, finish, and pattern to do the work. That
              makes it easier to judge what belongs on a chair, panel, cushion,
              bag, or custom fabrication project.
            </p>
            <p>
              The archive is organized around material families and intended use.
              Customers can move from jacquard to leather to vinyl, compare
              direction quickly, and still feel guided all the way to checkout.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-12 editorial-surface rounded-[2px] px-6 py-8 md:px-8 md:py-12">
        <p className="eyebrow">Editorial quote</p>
        <p className="mt-5 max-w-5xl font-display text-[2.55rem] leading-[0.96] tracking-[-0.05em] text-[var(--brand-ink)] md:text-6xl">
          “We want texture, scale, and order quantity to stay clear enough that
          you can choose confidently before checkout.”
        </p>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        <article className="editorial-frame min-h-[18rem] bg-[var(--brand-panel-strong)] md:min-h-[24rem]">
          {diptychLeft ? (
            <Image
              src={diptychLeft}
              alt="Archive material detail"
              fill
              unoptimized={isExternalImageUrl(diptychLeft)}
              className="object-cover"
            />
          ) : null}
        </article>
        <article className="editorial-frame min-h-[18rem] bg-[var(--brand-panel-strong)] md:min-h-[24rem]">
          {diptychRight ? (
            <Image
              src={diptychRight}
              alt="Archive material composition"
              fill
              unoptimized={isExternalImageUrl(diptychRight)}
              className="object-cover"
            />
          ) : null}
        </article>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {siteContent.valueProps.map((item) => (
          <div
            key={item.title}
            className="rounded-[2px] border border-[var(--brand-line)] bg-[rgba(252,251,248,0.82)] p-6 shadow-[0_18px_50px_rgba(16,21,31,0.05)]"
          >
            <p className="eyebrow">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-[2px] border border-[var(--brand-line)] bg-[var(--brand-ink)] px-6 py-8 text-white md:px-10 md:py-12">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow text-[rgba(255,245,230,0.75)]">
              Next step
            </p>
            <h2 className="mt-4 font-display text-[2.5rem] leading-[0.96] tracking-[-0.03em] md:text-5xl">
              Step into the archive the way it is meant to be browsed.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(255,245,230,0.76)]">
              Move from jacquard to leather to vinyl, compare the material
              direction, and source yardage for projects that need a clearer
              luxury finish.
            </p>
          </div>
          <LocalizedClientLink href="/store" className="brand-button">
            Enter the archive
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
