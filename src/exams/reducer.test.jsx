import { describe, expect, it } from "vitest"
import { EXAMS_FILTER_SET, EXAMS_PAGE_SET } from "./actions"
import { EXAM_FILTER_INITIAL_STATE, examActivePage, examFilter } from "./reducer"

describe("examActivePage", () => {
  it("defaults to 1", () => {
    expect(examActivePage(undefined, { type: "NOPE" })).toBe(1)
  })

  it("sets the page from the payload", () => {
    expect(examActivePage(1, { type: EXAMS_PAGE_SET, payload: 9 })).toBe(9)
  })

  it("keeps the current page on unrelated actions", () => {
    expect(examActivePage(2, { type: "NOPE" })).toBe(2)
  })
})

describe("examFilter", () => {
  it("starts with empty date, level and search", () => {
    expect(examFilter(undefined, { type: "NOPE" })).toEqual(EXAM_FILTER_INITIAL_STATE)
  })

  it("merges a partial filter update", () => {
    const next = examFilter(EXAM_FILTER_INITIAL_STATE, {
      type: EXAMS_FILTER_SET,
      payload: { date: "01.06.2025", search: "математика" },
    })
    expect(next).toEqual({ date: "01.06.2025", level: "", search: "математика" })
  })

  it("keeps the filter on unrelated actions", () => {
    const prev = { date: "", level: "", search: "x" }
    expect(examFilter(prev, { type: "NOPE" })).toBe(prev)
  })
})
