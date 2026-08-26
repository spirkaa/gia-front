import { describe, expect, it } from "vitest"
import { makeState } from "../test/fixtures"
import {
  countSelector,
  organisationDetailSelector,
  orgActivePageSelector,
  orgFilterSelector,
  organisationsOnPageSelector,
} from "./selectors"

const organisations = {
  o1: { id: "o1", name: "Школа 1", employees: ["e1", "e2"] },
  o2: { id: "o2", name: "Школа 2" },
}
const employees = {
  e1: { id: "e1", name: "Иван", org: "o1", exams: ["x1"] },
  e2: { id: "e2", name: "Пётр", org: "o1", exams: [] },
}
const orgPage = {
  1: { count: 2, results: ["o1", "o2"] },
  2: { count: 2, results: ["o2"] },
}

const listState = makeState({
  entities: { orgPage, organisation: organisations, employee: employees },
})

describe("countSelector", () => {
  it("reads the count from page 1", () => {
    expect(countSelector(listState)).toBe(2)
  })

  it("is null when the page is not loaded yet", () => {
    expect(countSelector(makeState())).toBeNull()
  })
})

describe("organisationsOnPageSelector", () => {
  it("maps page ids to organisation entities", () => {
    expect(organisationsOnPageSelector(listState)).toEqual([
      organisations.o1,
      organisations.o2,
    ])
  })

  it("returns an empty list when the active page is not loaded", () => {
    const state = makeState({
      entities: { orgPage, organisation: organisations, employee: employees },
      pagination: { ...makeState().pagination, orgActivePage: 5 },
    })
    expect(organisationsOnPageSelector(state)).toEqual([])
  })
})

describe("organisationDetailSelector", () => {
  it("denormalizes the organisation and its employees", () => {
    expect(organisationDetailSelector(listState, { orgId: "o1" })).toEqual({
      ...organisations.o1,
      employees: [employees.e1, employees.e2],
    })
  })

  it("returns the list-row organisation untouched when it has no employees key", () => {
    const listRow = { id: "o3", name: "Школа 3" }
    const state = makeState({ entities: { organisation: { o3: listRow } } })
    expect(organisationDetailSelector(state, { orgId: "o3" })).toEqual(listRow)
  })

  it("returns an empty shell for an unknown organisation", () => {
    expect(organisationDetailSelector(listState, { orgId: "nope" })).toEqual({
      employees: [],
    })
  })
})

describe("pass-through selectors", () => {
  it("reads the active page and the filter from the root state", () => {
    const state = makeState({
      filters: { ...makeState().filters, orgFilter: { search: "лицей" } },
      pagination: { ...makeState().pagination, orgActivePage: 2 },
    })
    expect(orgActivePageSelector(state)).toBe(2)
    expect(orgFilterSelector(state)).toEqual({ search: "лицей" })
  })
})
