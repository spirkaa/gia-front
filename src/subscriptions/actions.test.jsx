import { describe, expect, it, vi } from "vitest"

import { CALL_API } from "../middleware/api"
import Schemas from "../middleware/schemas"

import {
  SUBS_ADD_FAILURE,
  SUBS_ADD_REQUEST,
  SUBS_ADD_SUCCESS,
  SUBS_CLEAR_PAGES,
  SUBS_DEL_FAILURE,
  SUBS_DEL_REQUEST,
  SUBS_DEL_SUCCESS,
  SUBS_FAILURE,
  SUBS_PAGE_SET,
  SUBS_REQUEST,
  SUBS_SUCCESS,
} from "./constants"
import { subsAdd, subsClearPages, subsDel, subsLoad, subsPageSet } from "./actions"

describe("subsLoad", () => {
  it("loads the requested page", () => {
    const dispatch = vi.fn()
    subsLoad("jwt", 2)(dispatch, () => ({
      entities: { subsPage: {} },
    }))
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("subscription/?page=2")
    expect(call.method).toBe("GET")
    expect(call.schema).toBe(Schemas.SUBS_PAGE)
    expect(call.data).toEqual({ jwt: "jwt" })
    expect(call.types).toEqual([SUBS_REQUEST, SUBS_SUCCESS, SUBS_FAILURE])
  })

  it("skips the request when the page is already loaded", () => {
    const dispatch = vi.fn()
    const result = subsLoad("jwt", 2)(dispatch, () => ({
      entities: { subsPage: { 2: { random: null } } },
    }))
    expect(result).toBeNull()
    expect(dispatch).not.toHaveBeenCalled()
  })
})

describe("subsAdd", () => {
  it("posts the employee subscription", () => {
    const dispatch = vi.fn()
    subsAdd("jwt", { employee: "e1" })(dispatch)
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("subscription/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({ jwt: "jwt", employee: { employee: "e1" } })
    expect(call.types).toEqual([SUBS_ADD_REQUEST, SUBS_ADD_SUCCESS, SUBS_ADD_FAILURE])
  })
})

describe("subsDel", () => {
  it("deletes the subscription", () => {
    const dispatch = vi.fn()
    subsDel("jwt", "s1")(dispatch)
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("subscription/s1/")
    expect(call.method).toBe("DELETE")
    expect(call.data).toEqual({ jwt: "jwt" })
    expect(call.types).toEqual([SUBS_DEL_REQUEST, SUBS_DEL_SUCCESS, SUBS_DEL_FAILURE])
  })
})

describe("trigger and page actions", () => {
  it("subsClearPages builds a plain action", () => {
    expect(subsClearPages()).toEqual({ type: SUBS_CLEAR_PAGES })
  })

  it("subsPageSet carries the page payload", () => {
    expect(subsPageSet(3)).toEqual({ type: SUBS_PAGE_SET, payload: 3 })
  })
})
