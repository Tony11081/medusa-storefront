"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<
    | { country: string | undefined; region: string; label: string | undefined }
    | undefined
  >(undefined)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const { state, close, toggle } = toggleState

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    close()
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options?.find((o) => o?.country === countryCode)
            : undefined
        }
      >
        <ListboxButton
          className="flex w-full items-center justify-between gap-4 rounded-[2px] border border-[var(--brand-line)] bg-white px-4 py-3 text-left text-sm text-[var(--brand-ink)] shadow-[0_10px_22px_rgba(16,21,31,0.04)] transition hover:border-[var(--brand-line-strong)]"
          onClick={toggle}
        >
          <div className="flex min-w-0 items-start gap-x-2">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-soft)]">
              Shipping to
            </span>
            {current && (
              <span className="flex min-w-0 items-center gap-x-2 text-sm text-[var(--brand-ink)]">
                {/* @ts-ignore */}
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={current.country ?? ""}
                />
                <span className="truncate">{current.label}</span>
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--brand-soft)]">
            {state ? "Close" : "Change"}
          </span>
        </ListboxButton>
        <div className="relative flex w-full">
          <Transition
            show={state}
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <ListboxOptions
              className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[900] max-h-72 overflow-y-auto rounded-[2px] border border-[var(--brand-line)] bg-white p-1 shadow-[0_18px_42px_rgba(16,21,31,0.12)] no-scrollbar"
              static
            >
              {options?.map((o, index) => {
                return (
                  <ListboxOption
                    key={index}
                    value={o}
                    className="flex cursor-pointer items-center gap-x-2 rounded-[2px] px-3 py-2.5 text-sm text-[var(--brand-ink)] transition hover:bg-[rgba(17,23,20,0.06)]"
                  >
                    {/* @ts-ignore */}
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o?.country ?? ""}
                    />{" "}
                    {o?.label}
                  </ListboxOption>
                )
              })}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect
