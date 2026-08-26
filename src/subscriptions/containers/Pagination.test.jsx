import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CALL_API } from "../../middleware/api"
import api from "../../middleware/api"
import rootReducer from "../../reducer"
import { makeState } from "../../test/fixtures"
import { SUBS_PAGE_SET } from "../constants"
import Pagination from "./Pagination"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const emptyPage = { count: 0, next: null, previous: null, results: [] }

const renderPagination = (state) => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const store = createStore(rootReducer, state, applyMiddleware(recording, thunk, api))
  render(
    <Provider store={store}>
      <Pagination />
    </Provider>,
  )
  return { actions, store }
}

describe("subscriptions Pagination container", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(emptyPage) }),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders nothing when no count is loaded", () => {
    renderPagination(makeState())
    expect(screen.queryByRole("list")).not.toBeInTheDocument()
  })

  it("renders nothing when the count is at most 50", () => {
    const state = makeState({
      entities: { subsPage: { 1: { count: 50, random: null } } },
    })
    renderPagination(state)
    expect(screen.queryByRole("list")).not.toBeInTheDocument()
  })

  it("dispatches page set and subs load on page click", async () => {
    const user = userEvent.setup()
    const state = makeState({
      entities: { subsPage: { 1: { count: 150, random: null } } },
    })
    state.auth.token = "jwt"
    const { actions, store } = renderPagination(state)
    await user.click(screen.getByText("2"))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([SUBS_PAGE_SET, CALL_API])
    expect(actions[0].payload).toBe(2)
    const call = actions[1][CALL_API]
    expect(call.endpoint).toBe("subscription/?page=2")
    expect(call.method).toBe("GET")
    expect(call.data).toEqual({ jwt: "jwt" })
    expect(store.getState().pagination.subsActivePage).toBe(2)
  })
})
