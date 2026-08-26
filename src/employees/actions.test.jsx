import { describe, expect, it, vi } from "vitest"
import { CALL_API } from "../middleware/api"
import Schemas from "../middleware/schemas"

import {
  EMPLOYEE_FAILURE,
  EMPLOYEE_REQUEST,
  EMPLOYEE_SUCCESS,
  EMPLOYEES_FAILURE,
  EMPLOYEES_REQUEST,
  EMPLOYEES_SUCCESS,
  empFilterClearPages,
  empFilterSet,
  empPageSet,
  loadEmployeeDetail,
  loadEmployees,
} from "./actions"

describe("loadEmployees", () => {
  it("loads the requested page with the filter in the query string", () => {
    const dispatch = vi.fn()
    loadEmployees(2, { search: "иван" })(dispatch, () => ({
      entities: { empPage: {} },
    }))
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("employee/?search=иван&page=2")
    expect(call.method).toBe("GET")
    expect(call.schema).toBe(Schemas.EMP_PAGE)
    expect(call.types).toEqual([
      EMPLOYEES_REQUEST,
      EMPLOYEES_SUCCESS,
      EMPLOYEES_FAILURE,
    ])
  })

  it("skips the request when the page is already loaded", () => {
    const dispatch = vi.fn()
    const result = loadEmployees(2, { search: "иван" })(dispatch, () => ({
      entities: { empPage: { 2: { results: ["e1"] } } },
    }))
    expect(result).toBeNull()
    expect(dispatch).not.toHaveBeenCalled()
  })
})

describe("loadEmployeeDetail", () => {
  it("loads the detail when the cached employee has no exams yet", () => {
    const dispatch = vi.fn()
    loadEmployeeDetail("e1")(dispatch, () => ({
      entities: { employee: { e1: { id: "e1", name: "Иван" } } },
    }))
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("employee/e1/")
    expect(call.schema).toBe(Schemas.EMP_DETAIL)
    expect(call.types).toEqual([EMPLOYEE_REQUEST, EMPLOYEE_SUCCESS, EMPLOYEE_FAILURE])
  })

  it("skips the request when the cached employee already has its exams", () => {
    const dispatch = vi.fn()
    const result = loadEmployeeDetail("e1")(dispatch, () => ({
      entities: { employee: { e1: { id: "e1", name: "Иван", exams: [] } } },
    }))
    expect(result).toBeNull()
    expect(dispatch).not.toHaveBeenCalled()
  })
})

describe("filter and page actions", () => {
  it("empFilterSet carries the filter payload", () => {
    expect(empFilterSet({ search: "x" })).toEqual({
      type: "EMPLOYEES_FILTER_SET",
      payload: { search: "x" },
    })
  })

  it("empFilterClearPages and empPageSet build plain actions", () => {
    expect(empFilterClearPages()).toEqual({ type: "EMPLOYEES_FILTER_CLEAR_PAGES" })
    expect(empPageSet(3)).toEqual({ type: "EMPLOYEES_PAGE_SET", payload: 3 })
  })
})
