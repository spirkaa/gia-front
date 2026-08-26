import { describe, expect, it } from "vitest"
import { EMPLOYEES_FILTER_SET, EMPLOYEES_PAGE_SET } from "./actions"
import { EMP_FILTER_INITIAL_STATE, empActivePage, empFilter } from "./reducer"

describe("empActivePage", () => {
  it("defaults to 1", () => {
    expect(empActivePage(undefined, { type: "NOPE" })).toBe(1)
  })

  it("sets the page from the payload", () => {
    expect(empActivePage(1, { type: EMPLOYEES_PAGE_SET, payload: 3 })).toBe(3)
  })

  it("keeps the current page on unrelated actions", () => {
    expect(empActivePage(5, { type: "NOPE" })).toBe(5)
  })
})

describe("empFilter", () => {
  it("starts with an empty search", () => {
    expect(empFilter(undefined, { type: "NOPE" })).toEqual(EMP_FILTER_INITIAL_STATE)
  })

  it("merges a partial filter update", () => {
    const next = empFilter(
      { search: "" },
      {
        type: EMPLOYEES_FILTER_SET,
        payload: { search: "иван" },
      },
    )
    expect(next).toEqual({ search: "иван" })
  })

  it("keeps the filter on unrelated actions", () => {
    const prev = { search: "иван" }
    expect(empFilter(prev, { type: "NOPE" })).toBe(prev)
  })
})
