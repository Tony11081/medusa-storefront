"use client"

import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Fragment, useCallback, useState } from "react"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ sortBy, 'data-testid': dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <>
      <div className="mb-8 rounded-[2px] border border-[var(--brand-line)] bg-[rgba(252,251,248,0.86)] px-4 py-4 backdrop-blur-sm md:mb-10 md:px-6">
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex min-h-12 w-full items-center justify-between rounded-[2px] border border-[var(--brand-line-strong)] bg-[rgba(252,251,248,0.9)] px-4 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)] transition hover:border-[var(--brand-ink)]"
            data-testid="mobile-filter-sort-button"
          >
            <span>Filter & Sort</span>
            <span className="soft-caption !text-[var(--brand-ink)]">Open</span>
          </button>
        </div>
        <div className="hidden md:block">
          <SortProducts
            sortBy={sortBy}
            setQueryParams={setQueryParams}
            data-testid={dataTestId}
          />
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[70] md:hidden" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[rgba(18,22,20,0.48)] backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-x-0 bottom-0">
            <div className="flex min-h-full items-end justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-y-6 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="ease-in duration-200"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-6 opacity-0"
              >
                <Dialog.Panel className="w-full rounded-t-[1.75rem] border border-white/10 bg-[var(--brand-panel)] px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-[0_-28px_80px_rgba(18,22,20,0.26)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">Archive tools</p>
                      <Dialog.Title className="mt-3 font-display text-[2.2rem] leading-[0.96] tracking-[-0.04em] text-[var(--brand-ink)]">
                        Filter & sort
                      </Dialog.Title>
                      <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                        Refine the archive without losing the full-width product view.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--brand-line)] bg-white text-[var(--brand-ink)]"
                      aria-label="Close filter and sort"
                    >
                      <XMark />
                    </button>
                  </div>
                  <div className="mt-6 border-t border-[var(--brand-line)] pt-5">
                    <SortProducts
                      sortBy={sortBy}
                      setQueryParams={(name, value) => {
                        setQueryParams(name, value)
                        setIsOpen(false)
                      }}
                      data-testid={dataTestId}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default RefinementList
