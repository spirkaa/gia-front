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
import {
  EMPLOYEES_FILTER_CLEAR_PAGES,
  EMPLOYEES_FILTER_SET,
  EMPLOYEES_PAGE_SET,
} from "../actions"
import Filter from "./Filter"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const emptyPage = { count: 0, next: null, previous: null, results: [] }

const renderFilter = (state) => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const store = createStore(rootReducer, state, applyMiddleware(recording, thunk, api))
  render(
    <Provider store={store}>
      <Filter />
    </Provider>,
  )
  return { actions, store }
}

describe("employees Filter container", () => {
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

  it("dispatches filter set, clear, load and page set on search submit", async () => {
    const user = userEvent.setup()
    const { actions, store } = renderFilter(makeState())
    await user.type(screen.getByRole("textbox"), "иван")
    await user.click(screen.getByRole("button", { name: "Найти" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([
      EMPLOYEES_FILTER_SET,
      EMPLOYEES_FILTER_CLEAR_PAGES,
      CALL_API,
      EMPLOYEES_PAGE_SET,
    ])
    expect(actions[0].payload).toEqual({ search: "иван" })
    const call = actions[2][CALL_API]
    expect(call.endpoint).toBe("employee/?search=иван&page=1")
    expect(store.getState().filters.empFilter).toEqual({ search: "иван" })
    expect(store.getState().pagination.empActivePage).toBe(1)
  })

  it("does not dispatch when the submitted search is unchanged", async () => {
    const user = userEvent.setup()
    const state = makeState()
    state.filters.empFilter = { search: "иван" }
    const { actions } = renderFilter(state)
    await user.click(screen.getByRole("button", { name: "Найти" }))
    expect(actions).toEqual([])
  })
})
