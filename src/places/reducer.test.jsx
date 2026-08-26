import { describe, expect, it } from "vitest"
import { PLACES_FILTER_SET, PLACES_PAGE_SET } from "./actions"
import { PLACES_FILTER_INITIAL_STATE, placesActivePage, placesFilter } from "./reducer"

describe("placesActivePage", () => {
  it("defaults to 1", () => {
    expect(placesActivePage(undefined, { type: "NOPE" })).toBe(1)
  })

  it("sets the page from the payload", () => {
    expect(placesActivePage(1, { type: PLACES_PAGE_SET, payload: 6 })).toBe(6)
  })

  it("keeps the current page on unrelated actions", () => {
    expect(placesActivePage(4, { type: "NOPE" })).toBe(4)
  })
})

describe("placesFilter", () => {
  it("starts with an empty search", () => {
    expect(placesFilter(undefined, { type: "NOPE" })).toEqual(
      PLACES_FILTER_INITIAL_STATE,
    )
  })

  it("merges a partial filter update", () => {
    const next = placesFilter(PLACES_FILTER_INITIAL_STATE, {
      type: PLACES_FILTER_SET,
      payload: { search: "школа" },
    })
    expect(next).toEqual({ search: "школа" })
  })

  it("keeps the filter on unrelated actions", () => {
    const prev = { search: "школа" }
    expect(placesFilter(prev, { type: "NOPE" })).toBe(prev)
  })
})
