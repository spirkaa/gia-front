import { describe, expect, it, vi } from "vitest"
import { CALL_API } from "../middleware/api"
import Schemas from "../middleware/schemas"

import load, {
  DATASOURCES_FAILURE,
  DATASOURCES_REQUEST,
  DATASOURCES_SUCCESS,
  actionTrigger,
  actionWithPayload,
  authApi,
  loadDataSources,
  loadThis,
} from "./actions"

describe("load", () => {
  it("builds a CALL_API action with the given arguments", () => {
    const action = load(
      "employee/",
      ["A", "B", "C"],
      Schemas.EMP_PAGE,
      { page: 2 },
      "GET",
    )
    expect(action[CALL_API]).toEqual({
      types: ["A", "B", "C"],
      endpoint: "employee/",
      schema: Schemas.EMP_PAGE,
      data: { page: 2 },
      method: "GET",
    })
  })

  it("uses null schema, empty data and GET by default", () => {
    const action = load("employee/", ["A", "B", "C"])
    expect(action[CALL_API].schema).toBeNull()
    expect(action[CALL_API].data).toEqual({})
    expect(action[CALL_API].method).toBe("GET")
  })
})

describe("authApi", () => {
  it("dispatches a load action without a schema", () => {
    const dispatch = vi.fn()
    authApi({
      endpoint: "auth/login/",
      types: ["L1", "L2", "L3"],
      data: { email: "e", password: "p" },
      method: "POST",
    })(dispatch)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0][0][CALL_API]).toEqual({
      types: ["L1", "L2", "L3"],
      endpoint: "auth/login/",
      schema: null,
      data: { email: "e", password: "p" },
      method: "POST",
    })
  })
})

describe("loadThis", () => {
  const params = {
    source: "empPage",
    id: "2",
    requiredFields: ["results"],
    types: ["R", "S", "F"],
    endpoint: "employee/?page=2",
    schema: Schemas.EMP_PAGE,
  }

  it("skips the request when the object and all required fields are present", () => {
    const dispatch = vi.fn()
    const result = loadThis(params)(dispatch, () => ({
      entities: { empPage: { 2: { results: ["e1"] } } },
    }))
    expect(result).toBeNull()
    expect(dispatch).not.toHaveBeenCalled()
  })

  it("dispatches when the object is missing", () => {
    const dispatch = vi.fn()
    loadThis(params)(dispatch, () => ({ entities: { empPage: {} } }))
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch.mock.calls[0][0][CALL_API].endpoint).toBe("employee/?page=2")
  })

  it("dispatches when a required field is missing", () => {
    const dispatch = vi.fn()
    loadThis(params)(dispatch, () => ({ entities: { empPage: { 2: { count: 5 } } } }))
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})

describe("action creators", () => {
  it("actionTrigger builds an action with just the type", () => {
    expect(actionTrigger("T")).toEqual({ type: "T" })
  })

  it("actionWithPayload builds an action with the payload", () => {
    expect(actionWithPayload("T", 42)).toEqual({ type: "T", payload: 42 })
  })
})

describe("loadDataSources", () => {
  it("loads the datasource page when it is not cached", () => {
    const dispatch = vi.fn()
    loadDataSources()(dispatch, () => ({ entities: { dataSourcePage: {} } }))
    expect(dispatch).toHaveBeenCalledTimes(1)
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("datasource/")
    expect(call.types).toEqual([
      DATASOURCES_REQUEST,
      DATASOURCES_SUCCESS,
      DATASOURCES_FAILURE,
    ])
    expect(call.schema).toBe(Schemas.DATASOURCE_PAGE)
    expect(call.method).toBe("GET")
  })

  it("skips the request when the page is already cached", () => {
    const dispatch = vi.fn()
    const result = loadDataSources(1)(dispatch, () => ({
      entities: { dataSourcePage: { 1: { results: [] } } },
    }))
    expect(result).toBeNull()
    expect(dispatch).not.toHaveBeenCalled()
  })
})
