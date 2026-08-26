import { describe, expect, it } from "vitest"
import { ORGANISATIONS_FILTER_SET, ORGANISATIONS_PAGE_SET } from "./actions"
import { ORG_FILTER_INITIAL_STATE, orgActivePage, orgFilter } from "./reducer"

describe("orgActivePage", () => {
  it("defaults to 1", () => {
    expect(orgActivePage(undefined, { type: "NOPE" })).toBe(1)
  })

  it("sets the page from the payload", () => {
    expect(orgActivePage(1, { type: ORGANISATIONS_PAGE_SET, payload: 2 })).toBe(2)
  })

  it("keeps the current page on unrelated actions", () => {
    expect(orgActivePage(7, { type: "NOPE" })).toBe(7)
  })
})

describe("orgFilter", () => {
  it("starts with an empty search", () => {
    expect(orgFilter(undefined, { type: "NOPE" })).toEqual(ORG_FILTER_INITIAL_STATE)
  })

  it("merges a partial filter update", () => {
    const next = orgFilter(ORG_FILTER_INITIAL_STATE, {
      type: ORGANISATIONS_FILTER_SET,
      payload: { search: "лицей" },
    })
    expect(next).toEqual({ search: "лицей" })
  })

  it("keeps the filter on unrelated actions", () => {
    const prev = { search: "лицей" }
    expect(orgFilter(prev, { type: "NOPE" })).toBe(prev)
  })
})
