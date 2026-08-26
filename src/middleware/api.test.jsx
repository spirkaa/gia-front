import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { toast } from "react-toastify"

import Schemas from "./schemas"
import { CALL_API, default as api } from "./api"

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}))

const root = `http://${window.location.hostname}:8000/api/v1/`

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
  toast.error.mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const okJson = (body) => ({ ok: true, json: async () => body })
const errJson = (body) => ({ ok: false, json: async () => body })

const apiAction = (overrides = {}, extra = {}) => ({
  ...extra,
  [CALL_API]: {
    endpoint: "employee/",
    schema: null,
    types: ["REQ", "OK", "ERR"],
    method: "GET",
    data: {},
    ...overrides,
  },
})

describe("callApi behavior via the middleware", () => {
  it("prefixes the API root to relative endpoints and sends GET headers", async () => {
    fetchMock.mockResolvedValue(okJson({ hello: 1 }))
    const next = vi.fn()
    const p = api({})(next)(apiAction())
    await p
    expect(next).toHaveBeenCalledTimes(2)
    expect(next.mock.calls[1][0]).toMatchObject({ type: "OK", payload: { hello: 1 } })

    const [url, req] = fetchMock.mock.calls[0]
    expect(url).toBe(`${root}employee/`)
    expect(req.method).toBe("GET")
    expect(req.headers).toEqual({
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    expect(req.body).toBeUndefined()
  })

  it("keeps absolute URLs inside the API root untouched", async () => {
    fetchMock.mockResolvedValue(okJson({}))
    const next = vi.fn()
    await api({})(next)(apiAction({ endpoint: `${root}employee/` }))
    expect(fetchMock.mock.calls[0][0]).toBe(`${root}employee/`)
  })

  it("sends the jwt as an Authorization header and a JSON body on POST", async () => {
    fetchMock.mockResolvedValue(okJson({ access: "new-token" }))
    const next = vi.fn()
    await api({})(next)(
      apiAction(
        {
          endpoint: "auth/login/",
          method: "POST",
          data: { jwt: "tok", email: "i@i.ru", password: "p" },
        },
        { meta: "keep" },
      ),
    )
    const [url, req] = fetchMock.mock.calls[0]
    expect(url).toBe(`${root}auth/login/`)
    expect(req.headers.Authorization).toBe("JWT tok")
    expect(req.body).toBe(
      JSON.stringify({ jwt: "tok", email: "i@i.ru", password: "p" }),
    )

    const finalAction = next.mock.calls[1][0]
    expect(finalAction.meta).toBe("keep")
    expect(finalAction[CALL_API]).toBeUndefined()
  })

  it("normalizes the response when a schema is provided", async () => {
    fetchMock.mockResolvedValue(
      okJson({
        count: 1,
        next: null,
        previous: null,
        results: [{ id: "e1", name: "Иван", org: "o1" }],
      }),
    )
    const next = vi.fn()
    await api({})(next)(apiAction({ schema: Schemas.EMP_PAGE }))
    const payload = next.mock.calls[1][0].payload
    expect(payload.result).toBe(1)
    expect(payload.entities.employee.e1).toMatchObject({
      id: "e1",
      name: "Иван",
      org: "o1",
    })
    expect(payload.entities.organisation).toBeUndefined()
    expect(payload.entities.empPage["1"].results).toEqual(["e1"])
  })
})

describe("api middleware", () => {
  it("passes non-API actions through untouched", () => {
    const next = vi.fn()
    const action = { type: "PLAIN" }
    expect(api({})(next)(action)).toBeUndefined()
    expect(next).toHaveBeenCalledWith(action)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("dispatches the request action and strips the CALL_API key from later actions", async () => {
    fetchMock.mockResolvedValue(okJson({ ok: 1 }))
    const next = vi.fn()
    await api({})(next)(apiAction())
    expect(next.mock.calls[0][0]).toMatchObject({ type: "REQ" })
    expect(next.mock.calls[0][0][CALL_API]).toBeUndefined()
    expect(next.mock.calls[1][0][CALL_API]).toBeUndefined()
  })

  it("dispatches a failure action for error responses", async () => {
    fetchMock.mockResolvedValue(errJson({ detail: "bad" }))
    const next = vi.fn()
    await api({})(next)(apiAction())
    expect(next.mock.calls[1][0]).toEqual({
      type: "ERR",
      payload: { detail: "bad" },
      error: true,
    })
    expect(toast.error).not.toHaveBeenCalled()
  })

  it("toasts the message when the failure is an Error", async () => {
    fetchMock.mockRejectedValue(new Error("boom"))
    const next = vi.fn()
    await api({})(next)(apiAction())
    expect(next.mock.calls[1][0]).toEqual({ type: "ERR", payload: "boom", error: true })
    expect(toast.error).toHaveBeenCalledWith("boom", { title: "API Error" })
  })

  it.each([
    [{ endpoint: 123 }, "Specify a string endpoint URL."],
    [{ types: ["A", "B"] }, "Expected an array of three action types."],
    [{ types: ["A", 2, "C"] }, "Expected action types to be strings."],
  ])("rejects malformed CALL_API actions: %j", (overrides, message) => {
    const next = vi.fn()
    expect(() => api({})(next)(apiAction(overrides))).toThrow(message)
  })
})
