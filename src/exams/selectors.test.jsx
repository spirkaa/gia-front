import { describe, expect, it } from "vitest"
import { makeState } from "../test/fixtures"
import {
  countSelector,
  datesSelector,
  examActivePageSelector,
  examFilterSelector,
  examsOnPageSelector,
  examsWithDetailsSelector,
  levelsSelector,
} from "./selectors"

const organisations = { o1: { id: "o1", name: "Школа 1" } }
const employees = { e1: { id: "e1", name: "Иван", org: "o1", exams: ["x1"] } }
const dates = { d1: { id: "d1", date: "2025-06-01" } }
const levels = { l1: { id: "l1", level: "ГИА" } }
const positions = { p1: { id: "p1", name: "Протоколист ППЭ" } }
const places = {
  pl1: { id: "pl1", code: "123", name: "Школа 1", addr: "ул. X, 1", ate: "t1" },
}
const examPage = {
  1: { count: 2, results: ["x1", "x2"] },
  2: { count: 2, results: ["x2"] },
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
  x2: {
    id: "x2",
    date: "d1",
    level: "l1",
    position: "p1",
    place: "pl1",
    employee: "e1",
  },
}

const listState = makeState({
  entities: {
    examPage,
    exam: exams,
    employee: employees,
    organisation: organisations,
    date: dates,
    level: levels,
    position: positions,
    place: places,
  },
})

describe("countSelector", () => {
  it("reads the count from page 1", () => {
    expect(countSelector(listState)).toBe(2)
  })

  it("is null when the page is not loaded yet", () => {
    expect(countSelector(makeState())).toBeNull()
  })
})

describe("examsOnPageSelector", () => {
  it("maps page ids to raw exam entities", () => {
    expect(examsOnPageSelector(listState)).toEqual([exams.x1, exams.x2])
  })

  const pageState = (examActivePage) =>
    makeState({
      entities: {
        examPage,
        exam: exams,
        employee: employees,
        organisation: organisations,
        date: dates,
        level: levels,
        position: positions,
        place: places,
      },
      pagination: { ...makeState().pagination, examActivePage },
    })

  it("follows the active page number", () => {
    expect(examsOnPageSelector(pageState(2))).toEqual([exams.x2])
  })

  it("returns an empty list when the active page is not loaded", () => {
    expect(examsOnPageSelector(pageState(9))).toEqual([])
  })
})

describe("examsWithDetailsSelector", () => {
  it("denormalizes date, level, position, place and employee", () => {
    const [exam] = examsWithDetailsSelector(listState)
    expect(exam.date).toBe("2025-06-01")
    expect(exam.level).toBe("ГИА")
    expect(exam.position).toBe("Протоколист ППЭ")
    expect(exam.place).toEqual(places.pl1)
    expect(exam.employee).toEqual({ ...employees.e1, org: organisations.o1 })
  })
})

describe("datesSelector and levelsSelector", () => {
  it("maps the page 1 results to date strings and level names", () => {
    const state = makeState({
      entities: {
        datePage: { 1: { count: 1, results: ["d1"] } },
        levelPage: { 1: { count: 1, results: ["l1"] } },
        date: dates,
        level: levels,
      },
    })
    expect(datesSelector(state)).toEqual(["2025-06-01"])
    expect(levelsSelector(state)).toEqual(["ГИА"])
  })

  it("returns empty arrays when the pages are not loaded", () => {
    expect(datesSelector(makeState())).toEqual([])
    expect(levelsSelector(makeState())).toEqual([])
  })
})

describe("pass-through selectors", () => {
  it("reads the active page and the filter from the root state", () => {
    const state = makeState({
      filters: {
        ...makeState().filters,
        examFilter: { date: "d", level: "", search: "s" },
      },
      pagination: { ...makeState().pagination, examActivePage: 7 },
    })
    expect(examActivePageSelector(state)).toBe(7)
    expect(examFilterSelector(state)).toEqual({ date: "d", level: "", search: "s" })
  })
})
