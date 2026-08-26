import { describe, expect, it } from "vitest"
import { AUTH_LOGOUT } from "../auth/constants"
import { EMPLOYEES_FILTER_CLEAR_PAGES } from "../employees/actions"
import { EXAMS_FILTER_CLEAR_PAGES } from "../exams/actions"
import { ORGANISATIONS_FILTER_CLEAR_PAGES } from "../organisations/actions"
import { PLACES_FILTER_CLEAR_PAGES } from "../places/actions"
import { SUBS_CLEAR_PAGES } from "../subscriptions/constants"
import { entities } from "./reducer"

describe("entities", () => {
  it("starts with empty entity tables", () => {
    const state = entities(undefined, { type: "unknown" })
    expect(state.employee).toEqual({})
    expect(state.empPage).toEqual({})
    expect(state.subscription).toEqual({})
  })

  it("merges a normalized payload into the state", () => {
    const state = entities(undefined, {
      type: "EMPLOYEES_SUCCESS",
      payload: {
        entities: {
          employee: {
            e1: { id: "e1", name: "Иван", org: "o1" },
            e2: { id: "e2", name: "Пётр", org: "o2" },
          },
          organisation: {
            o1: { id: "o1", name: "Школа 1" },
            o2: { id: "o2", name: "Школа 2" },
          },
          empPage: { 1: { count: 2, results: ["e1", "e2"] } },
        },
      },
    })
    expect(state.employee.e1).toEqual({ id: "e1", name: "Иван", org: "o1" })
    expect(state.employee.e2).toEqual({ id: "e2", name: "Пётр", org: "o2" })
    expect(state.organisation.o1).toEqual({ id: "o1", name: "Школа 1" })
    expect(state.empPage).toEqual({ 1: { count: 2, results: ["e1", "e2"] } })
  })

  it("deep-merges into already stored entities", () => {
    const prev = {
      employee: { e1: { id: "e1", name: "Иван" } },
    }
    const next = entities(prev, {
      type: "EMPLOYEE_SUCCESS",
      payload: {
        entities: {
          employee: { e1: { id: "e1", exams: ["x1"] } },
        },
      },
    })
    expect(next.employee.e1).toEqual({ id: "e1", name: "Иван", exams: ["x1"] })
  })

  it.each([
    [EMPLOYEES_FILTER_CLEAR_PAGES, "empPage"],
    [EXAMS_FILTER_CLEAR_PAGES, "examPage"],
    [ORGANISATIONS_FILTER_CLEAR_PAGES, "orgPage"],
    [PLACES_FILTER_CLEAR_PAGES, "placesPage"],
  ])("resets the %s page table on %s and keeps the others", (type, key) => {
    const prev = {
      empPage: { 1: { results: ["e1"] } },
      examPage: { 1: { results: ["x1"] } },
      orgPage: { 1: { results: ["o1"] } },
      placesPage: { 1: { results: ["p1"] } },
    }
    const next = entities(prev, { type })
    expect(next[key]).toEqual({})
    for (const other of Object.keys(prev)) {
      if (other !== key) expect(next[other]).toEqual(prev[other])
    }
  })

  it.each([SUBS_CLEAR_PAGES, AUTH_LOGOUT])(
    "clears subsPage and subscription on %s",
    (type) => {
      const prev = {
        subsPage: { 1: { results: ["s1"] } },
        subscription: { s1: { id: "s1" } },
      }
      const next = entities(prev, { type })
      expect(next.subsPage).toEqual({})
      expect(next.subscription).toEqual({})
    },
  )

  it("returns the same state for unrelated actions", () => {
    const prev = { empPage: { 1: { results: ["e1"] } } }
    expect(entities(prev, { type: "NOPE" })).toBe(prev)
  })
})
