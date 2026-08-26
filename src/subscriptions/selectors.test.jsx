import { describe, expect, it } from "vitest"
import { makeState } from "../test/fixtures"
import {
  countSelector,
  subsActivePageSelector,
  subsOnPageSelector,
  subsWithExamsSelector,
} from "./selectors"

const organisations = { o1: { id: "o1", name: "Школа 1" } }
const dates = { d1: { id: "d1", date: "2025-06-01" } }
const levels = { l1: { id: "l1", level: "ГИА" } }
const positions = { p1: { id: "p1", name: "Председатель ППЭ" } }
const places = {
  pl1: { id: "pl1", code: "123", name: "Школа 1", addr: "ул. X, 1", ate: "t1" },
}
const employees = {
  e1: { id: "e1", name: "Иван", org: "o1", exams: ["x1"] },
}
const exams = {
  x1: {
    id: "x1",
    date: "d1",
    level: "l1",
    position: "p1",
    place: "pl1",
    employee: "e1",
  },
}
const subscriptions = {
  s1: { id: "s1", email: "i@i.ru", employee: "e1" },
}
const subsPage = {
  1: { count: 1, results: ["s1"] },
  2: { count: 1, results: ["s1"] },
}

const listState = makeState({
  entities: {
    subsPage,
    subscription: subscriptions,
    employee: employees,
    organisation: organisations,
    exam: exams,
    date: dates,
    level: levels,
    position: positions,
    place: places,
  },
})

describe("countSelector", () => {
  it("reads the count from page 1", () => {
    expect(countSelector(listState)).toBe(1)
  })

  it("is 0 when the page is not loaded yet", () => {
    expect(countSelector(makeState())).toBe(0)
  })
})

describe("subsOnPageSelector", () => {
  it("denormalizes the employee with its organisation", () => {
    expect(subsOnPageSelector(listState)).toEqual([
      { ...subscriptions.s1, employee: { ...employees.e1, org: organisations.o1 } },
    ])
  })

  it("follows the active page number", () => {
    const state = makeState({
      entities: {
        subsPage,
        subscription: subscriptions,
        employee: employees,
        organisation: organisations,
      },
      pagination: { ...makeState().pagination, subsActivePage: 2 },
    })
    expect(subsOnPageSelector(state)).toEqual([
      { ...subscriptions.s1, employee: { ...employees.e1, org: organisations.o1 } },
    ])
  })
})

describe("subsWithExamsSelector", () => {
  it("denormalizes the employee's exams like the employee detail", () => {
    const [sub] = subsWithExamsSelector(listState)
    expect(sub.employee.exams).toEqual([
      {
        ...exams.x1,
        date: "2025-06-01",
        level: "ГИА",
        position: "Председатель ППЭ",
        place: places.pl1,
      },
    ])
  })
})

describe("pass-through selectors", () => {
  it("reads the active page from the root state", () => {
    const state = makeState({
      pagination: { ...makeState().pagination, subsActivePage: 8 },
    })
    expect(subsActivePageSelector(state)).toBe(8)
  })
})
