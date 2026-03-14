"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import { siteContent } from "@lib/site-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"

const primaryLinks = [
  {
    label: "Archive",
    href: "/store",
    detail: "Browse the full designer textile archive",
  },
  {
    label: "Guide",
    href: "/guide",
    detail: "Shipping, swatches, sourcing, and ordering notes",
  },
]

const utilityLinks = [
  {
    label: "About",
    href: "/about",
    detail: "Read the sourcing-led brand story",
  },
  {
    label: "Account",
    href: "/account",
    detail: "Track orders and manage saved details",
  },
  {
    label: "Cart",
    href: "/cart",
    detail: "Review yardage and checkout",
  },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="inline-flex min-h-10 items-center rounded-full border border-[var(--brand-line-strong)] bg-white/84 px-4 text-[11px] uppercase tracking-[0.24em] text-[var(--brand-soft)] shadow-[0_10px_22px_rgba(16,21,31,0.04)] transition-all duration-200 ease-out hover:border-[var(--brand-ink)] hover:text-[var(--brand-ink)] focus:outline-none"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-[rgba(16,18,18,0.26)] backdrop-blur-sm"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-6"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 z-[51] w-full max-w-[26rem] text-[var(--brand-ink)] sm:max-w-[28rem]">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex h-full flex-col border-r border-[var(--brand-line)] bg-[var(--brand-canvas)] shadow-[0_26px_80px_rgba(16,21,31,0.16)]"
                  >
                    <div className="border-b border-[var(--brand-line)] px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="eyebrow">{siteContent.eyebrow}</p>
                          <div className="mt-4 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-[var(--brand-line-strong)] bg-white font-display text-xs uppercase tracking-[0.26em] text-[var(--brand-ink)] shadow-[0_12px_28px_rgba(16,21,31,0.06)]">
                              {siteContent.shortName}
                            </span>
                            <div className="min-w-0">
                              <p className="font-display text-[1.55rem] leading-none tracking-[-0.04em] text-[var(--brand-ink)]">
                                {siteContent.name}
                              </p>
                              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--brand-muted)]">
                                {siteContent.footerNote}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          data-testid="close-menu-button"
                          onClick={close}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-line)] bg-white text-[var(--brand-soft)] transition hover:border-[var(--brand-line-strong)] hover:text-[var(--brand-ink)]"
                          aria-label="Close menu"
                        >
                          <XMark />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                      <section>
                        <p className="soft-caption">Start here</p>
                        <div className="mt-3 grid gap-3">
                          {primaryLinks.map((link) => (
                            <LocalizedClientLink
                              key={link.href}
                              href={link.href}
                              onClick={close}
                              data-testid={`${link.label.toLowerCase()}-link`}
                              className="group rounded-[2px] border border-[var(--brand-line)] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(16,21,31,0.04)] transition hover:border-[var(--brand-line-strong)] hover:shadow-[0_18px_40px_rgba(16,21,31,0.08)]"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-lg font-medium text-[var(--brand-ink)]">
                                    {link.label}
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                                    {link.detail}
                                  </p>
                                </div>
                                <ArrowRightMini className="mt-1 shrink-0 text-[var(--brand-soft)] transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-ink)]" />
                              </div>
                            </LocalizedClientLink>
                          ))}
                        </div>
                      </section>

                      <section className="mt-6">
                        <div className="flex items-center justify-between gap-4">
                          <p className="soft-caption">Quick links</p>
                          <LocalizedClientLink
                            href="/"
                            onClick={close}
                            className="text-[10px] uppercase tracking-[0.22em] text-[var(--brand-accent-soft)]"
                          >
                            Home
                          </LocalizedClientLink>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {utilityLinks.map((link) => (
                            <LocalizedClientLink
                              key={link.href}
                              href={link.href}
                              onClick={close}
                              className="rounded-[2px] border border-[var(--brand-line)] bg-[rgba(255,255,255,0.72)] px-3 py-3 transition hover:border-[var(--brand-line-strong)] hover:bg-white"
                            >
                              <p className="text-sm font-medium text-[var(--brand-ink)]">
                                {link.label}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-[var(--brand-muted)]">
                                {link.detail}
                              </p>
                            </LocalizedClientLink>
                          ))}
                        </div>
                      </section>

                      <section className="mt-6">
                        <p className="soft-caption">Browse by material</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {siteContent.categoryCards.map((card) => (
                            <LocalizedClientLink
                              key={card.href}
                              href={card.href}
                              onClick={close}
                              className="group rounded-[2px] border border-[var(--brand-line)] bg-[rgba(255,255,255,0.72)] px-3 py-3 transition hover:border-[var(--brand-line-strong)] hover:bg-white"
                            >
                              <p className="text-sm font-medium text-[var(--brand-ink)]">
                                {card.title}
                              </p>
                              <p className="mt-1 line-clamp-3 text-xs leading-5 text-[var(--brand-muted)]">
                                {card.description}
                              </p>
                            </LocalizedClientLink>
                          ))}
                        </div>
                      </section>

                      <section className="mt-6 rounded-[2px] border border-[var(--brand-line)] bg-[rgba(255,255,255,0.82)] p-4">
                        <p className="soft-caption">Need help before ordering?</p>
                        <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                          Ask for project-fit advice, closer texture shots, or
                          support before placing a larger yardage order.
                        </p>
                        <div className="mt-4 flex flex-col items-start gap-3">
                          <a
                            href={`mailto:${siteContent.supportEmail}`}
                            className="brand-link"
                          >
                            Contact the studio
                          </a>
                          <LocalizedClientLink
                            href="/guide"
                            onClick={close}
                            className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-soft)] underline underline-offset-4"
                          >
                            Read the buying guide
                          </LocalizedClientLink>
                        </div>
                      </section>
                    </div>

                    <div className="border-t border-[var(--brand-line)] bg-[rgba(255,255,255,0.68)] px-5 pb-[calc(env(safe-area-inset-bottom)+1.1rem)] pt-4 sm:px-6">
                      <div className="grid gap-3">
                        {!!locales?.length && (
                          <div
                            className={clx(
                              "transition",
                              languageToggleState.state ? "pb-1" : ""
                            )}
                          >
                            <LanguageSelect
                              toggleState={languageToggleState}
                              locales={locales}
                              currentLocale={currentLocale}
                            />
                          </div>
                        )}
                        {regions && (
                          <div
                            className={clx(
                              "transition",
                              countryToggleState.state ? "pb-1" : ""
                            )}
                          >
                            <CountrySelect
                              toggleState={countryToggleState}
                              regions={regions}
                            />
                          </div>
                        )}
                        <Text className="pt-1 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-soft)]">
                          © {new Date().getFullYear()} {siteContent.name}
                        </Text>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
