import { describe, expect, it } from "vitest"
import * as c from "./constants"
import { subs, subsActivePage } from "./reducer"

describe("subs", () => {
  it("sets isSubRequesting and clears the message on request", () => {
    expect(subs(undefined, { type: c.SUBS_REQUEST })).toEqual({
      isSubRequesting: true,
      subsMsg: {},
    })
  })

  it("resets isSubRequesting on success", () => {
    expect(subs(undefined, { type: c.SUBS_SUCCESS })).toEqual({
      isSubRequesting: false,
      subsMsg: {},
    })
  })

  it("stores the error message on failure", () => {
    const next = subs(undefined, { type: c.SUBS_FAILURE, payload: { detail: "bad" } })
    expect(next.isSubRequesting).toBe(false)
    expect(next.subsMsg).toEqual({ detail: "bad" })
  })

  it("sets isSubAddRequesting on add request", () => {
    expect(subs(undefined, { type: c.SUBS_ADD_REQUEST })).toEqual({
      isSubAddRequesting: true,
      isSubAddRequested: false,
      subsMsg: {},
    })
  })

  it("marks the add as done and stores the message on add success/failure", () => {
    const ok = subs(undefined, { type: c.SUBS_ADD_SUCCESS, payload: { detail: "ok" } })
    expect(ok.isSubAddRequesting).toBe(false)
    expect(ok.isSubAddRequested).toBe(true)
    expect(ok.subsMsg).toEqual({ detail: "ok" })

    const fail = subs(undefined, {
      type: c.SUBS_ADD_FAILURE,
      payload: { detail: "bad" },
    })
    expect(fail.isSubAddRequested).toBe(true)
    expect(fail.subsMsg).toEqual({ detail: "bad" })
  })

  it("sets isSubDelRequesting on delete request", () => {
    expect(subs(undefined, { type: c.SUBS_DEL_REQUEST })).toEqual({
      isSubDelRequesting: true,
      isSubDelRequested: false,
      subsMsg: {},
    })
  })

  it("marks the delete as done and stores the message on delete success/failure", () => {
    const ok = subs(undefined, { type: c.SUBS_DEL_SUCCESS, payload: { detail: "ok" } })
    expect(ok.isSubDelRequesting).toBe(false)
    expect(ok.isSubDelRequested).toBe(true)
    expect(ok.subsMsg).toEqual({ detail: "ok" })

    const fail = subs(undefined, {
      type: c.SUBS_DEL_FAILURE,
      payload: { detail: "bad" },
    })
    expect(fail.isSubDelRequested).toBe(true)
    expect(fail.subsMsg).toEqual({ detail: "bad" })
  })

  it("returns the same state for unrelated actions", () => {
    const prev = { isSubRequesting: false, subsMsg: {} }
    expect(subs(prev, { type: "NOPE" })).toBe(prev)
  })
})

describe("subsActivePage", () => {
  it("defaults to 1", () => {
    expect(subsActivePage(undefined, { type: "NOPE" })).toBe(1)
  })

  it("sets the page from the payload", () => {
    expect(subsActivePage(1, { type: c.SUBS_PAGE_SET, payload: 4 })).toBe(4)
  })
})
