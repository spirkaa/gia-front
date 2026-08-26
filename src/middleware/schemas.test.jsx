import { describe, expect, it } from "vitest"
import { normalize } from "normalizr"

import Schemas from "./schemas"

const employeeJson = (id, org = "o1") => ({
  id,
  name: `Employee ${id}`,
  org,
  exams: [],
})

describe("Schemas.EMP_PAGE", () => {
  it("normalizes a first page (no next/previous) under the key 1", () => {
    const { entities, result } = normalize(
      {
        count: 2,
        next: null,
        previous: null,
        results: [employeeJson("e1"), employeeJson("e2")],
      },
      Schemas.EMP_PAGE,
    )
    expect(result).toBe(1)
    expect(entities.empPage["1"].results).toEqual(["e1", "e2"])
    expect(entities.employee.e1).toMatchObject({ id: "e1", org: "o1" })
    expect(entities.organisation).toBeUndefined()
  })

  it("computes the page key from the previous page URL", () => {
    const { entities } = normalize(
      {
        count: 3,
        next: null,
        previous: "http://localhost:8000/api/v1/employee/?search=&page=2",
        results: [employeeJson("e1")],
      },
      Schemas.EMP_PAGE,
    )
    expect(entities.empPage["3"].results).toEqual(["e1"])
    expect(entities.empPage["1"]).toBeUndefined()
  })

  it("computes the page key from the next page URL", () => {
    const { entities } = normalize(
      {
        count: 3,
        next: "http://localhost:8000/api/v1/employee/?search=&page=2",
        previous: null,
        results: [employeeJson("e1")],
      },
      Schemas.EMP_PAGE,
    )
    expect(entities.empPage["1"].results).toEqual(["e1"])
  })
})

describe("Schemas.EXAM_PAGE", () => {
  it("denormalizes the nested date, level, position, place and employee", () => {
    const { entities, result } = normalize(
      {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: "x1",
            date: { id: "d1", date: "2025-06-01" },
            level: { id: "l1", level: "ГИА" },
            position: { id: "p1", name: "Председатель ППЭ" },
            place: {
              id: "pl1",
              code: "123",
              name: "Школа 1",
              addr: "ул. X, 1",
              ate: { id: "t1", name: "Центр" },
            },
            employee: employeeJson("e1"),
          },
        ],
      },
      Schemas.EXAM_PAGE,
    )
    expect(result).toBe(1)
    expect(entities.examPage["1"].results).toEqual(["x1"])
    expect(entities.exam.x1).toMatchObject({
      id: "x1",
      date: "d1",
      level: "l1",
      position: "p1",
      place: "pl1",
      employee: "e1",
    })
    expect(entities.date.d1.date).toBe("2025-06-01")
    expect(entities.level.l1.level).toBe("ГИА")
    expect(entities.position.p1.name).toBe("Председатель ППЭ")
    expect(entities.place.pl1.ate).toBe("t1")
    expect(entities.territory.t1.name).toBe("Центр")
    expect(entities.employee.e1.org).toBe("o1")
  })
})

describe("Schemas.EMP_DETAIL", () => {
  it("normalizes a single employee with its exams and organisation", () => {
    const { entities, result } = normalize(
      {
        ...employeeJson("e1"),
        org: { id: "o1", name: "Школа 1" },
        exams: [
          {
            id: "x1",
            date: "d1",
            level: "l1",
            position: "p1",
            place: "pl1",
            employee: "e1",
          },
        ],
      },
      Schemas.EMP_DETAIL,
    )
    expect(result).toBe("e1")
    expect(entities.employee.e1.exams).toEqual(["x1"])
    expect(entities.employee.e1.org).toBe("o1")
    expect(entities.organisation.o1.name).toBe("Школа 1")
    expect(entities.exam.x1.employee).toBe("e1")
  })
})

describe("Schemas.SUBS_PAGE", () => {
  it("normalizes subscriptions with their employee", () => {
    const { entities, result } = normalize(
      {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: "s1",
            email: "i@i.ru",
            employee: employeeJson("e1"),
          },
        ],
      },
      Schemas.SUBS_PAGE,
    )
    expect(result).toBe(1)
    expect(entities.subsPage["1"].results).toEqual(["s1"])
    expect(entities.subscription.s1.employee).toBe("e1")
    expect(entities.employee.e1.org).toBe("o1")
  })
})

describe("Schemas export", () => {
  it("exposes all the schemas used by the actions", () => {
    expect(Object.keys(Schemas).sort()).toEqual(
      [
        "DATE_PAGE",
        "LEVEL_PAGE",
        "EMP_PAGE",
        "EXAM_PAGE",
        "ORG_PAGE",
        "PLACES_PAGE",
        "EMP_DETAIL",
        "ORG_DETAIL",
        "DATASOURCE_PAGE",
        "SUBS_PAGE",
      ].sort(),
    )
  })
})
