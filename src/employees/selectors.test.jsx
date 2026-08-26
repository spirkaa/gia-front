import { describe, expect, it } from "vitest"
import { makeState } from "../test/fixtures"
import {
  countSelector,
  empActivePageSelector,
  empFilterSelector,
  employeeDetailSelector,
  employeesOnPageSelector,
  examDetailSelector,
} from "./selectors"

const organisations = {
  o1: { id: "o1", name: "Школа 1" },
  o2: { id: "o2", name: "Школа 2" },
}
const employees = {
  e1: { id: "e1", name: "Иван", org: "o1", exams: ["x1"] },
  e2: { id: "e2", name: "Пётр", org: "o2", exams: [] },
}
const dates = { d1: { id: "d1", date: "2025-06-01" } }
const levels = { l1: { id: "l1", level: "ГИА" } }
const positions = { p1: { id: "p1", name: "Председатель ППЭ" } }
const places = {
  pl1: { id: "pl1", code: "123", name: "Школа 1", addr: "ул. X, 1", ate: "t1" },
}
const territories = { t1: { id: "t1", name: "Центр" } }
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
const empPage = {
  1: { count: 2, results: ["e1", "e2"] },
  2: { count: 2, results: ["e2"] },
}

const listState = makeState({
  entities: { empPage, employee: employees, organisation: organisations },
})

describe("countSelector", () => {
  it("reads the count from page 1", () => {
    expect(countSelector(listState)).toBe(2)
  })

  it("is null when the page is not loaded yet", () => {
    expect(countSelector(makeState())).toBeNull()
  })
})

describe("employeesOnPageSelector", () => {
  it("maps page ids to employees with the organisation denormalized", () => {
    expect(employeesOnPageSelector(listState)).toEqual([
      { ...employees.e1, org: organisations.o1 },
      { ...employees.e2, org: organisations.o2 },
    ])
  })

  it("follows the active page number", () => {
    const state = makeState({
      entities: { empPage, employee: employees, organisation: organisations },
      pagination: { ...makeState().pagination, empActivePage: 2 },
    })
    expect(employeesOnPageSelector(state)).toEqual([
      { ...employees.e2, org: organisations.o2 },
    ])
  })

  it("returns an empty list when the active page is not loaded", () => {
    const state = makeState({
      entities: { empPage, employee: employees, organisation: organisations },
      pagination: { ...makeState().pagination, empActivePage: 3 },
    })
    expect(employeesOnPageSelector(state)).toEqual([])
  })
})

describe("employeeDetailSelector", () => {
  const state = makeState({
    entities: {
      employee: employees,
      organisation: organisations,
      exam: exams,
      date: dates,
      level: levels,
      position: positions,
      place: places,
      territory: territories,
    },
  })

  it("denormalizes the employee, its exams and its organisation", () => {
    expect(employeeDetailSelector(state, { employeeId: "e1" })).toEqual({
      ...employees.e1,
      org: organisations.o1,
      exams: [
        {
          ...exams.x1,
          date: "2025-06-01",
          level: "ГИА",
          position: "Председатель ППЭ",
          place: places.pl1,
        },
      ],
    })
  })

  it("denormalizes exams through examDetailSelector as well", () => {
    const [exam] = examDetailSelector(state, { employeeId: "e1" })
    expect(exam.date).toBe("2025-06-01")
    expect(exam.level).toBe("ГИА")
    expect(exam.position).toBe("Председатель ППЭ")
    expect(exam.place).toEqual(places.pl1)
  })

  it("returns the list-row employee untouched when it has no exams key", () => {
    const listRow = { id: "e3", name: "Мария", org: "o1" }
    const s = makeState({
      entities: { employee: { e3: listRow }, organisation: organisations },
    })
    expect(employeeDetailSelector(s, { employeeId: "e3" })).toEqual(listRow)
  })

  it("returns an empty shell for an unknown employee", () => {
    const result = employeeDetailSelector(listState, { employeeId: "nope" })
    expect(result.exams).toEqual([])
    expect(result.org).toBeUndefined()
  })
})

describe("pass-through selectors", () => {
  it("reads the active page and the filter from the root state", () => {
    const state = makeState({
      filters: { ...makeState().filters, empFilter: { search: "иван" } },
      pagination: { ...makeState().pagination, empActivePage: 4 },
    })
    expect(empActivePageSelector(state)).toBe(4)
    expect(empFilterSelector(state)).toEqual({ search: "иван" })
  })
})
