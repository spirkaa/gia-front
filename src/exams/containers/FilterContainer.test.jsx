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
import { EXAMS_FILTER_CLEAR_PAGES, EXAMS_FILTER_SET, EXAMS_PAGE_SET } from "../actions"
import FilterContainer from "./FilterContainer"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

vi.mock("../components", () => ({
  Filter: ({ onChange }) => (
    <button
      type="button"
      onClick={() =>
        onChange({ date: "2019-06-26", level: "11", search: "математика" })
      }>
      apply-filter
    </button>
  ),
}))

const SUBMITTED = { date: "2019-06-26", level: "11", search: "математика" }

const emptyPage = { count: 0, next: null, previous: null, results: [] }

const renderFilterContainer = (state) => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const store = createStore(rootReducer, state, applyMiddleware(recording, thunk, api))
  render(
    <Provider store={store}>
      <FilterContainer />
    </Provider>,
  )
  return { actions, store }
}

describe("exams Filter container", () => {
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

  it("dispatches filter set, clear, load and page set when the child filter changes", async () => {
    const user = userEvent.setup()
    const { actions, store } = renderFilterContainer(makeState())
    await user.click(screen.getByRole("button", { name: "apply-filter" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([
      EXAMS_FILTER_SET,
      EXAMS_FILTER_CLEAR_PAGES,
      CALL_API,
      EXAMS_PAGE_SET,
    ])
    expect(actions[0].payload).toEqual(SUBMITTED)
    const call = actions[2][CALL_API]
    expect(call.endpoint).toContain("date=2019-06-26")
    expect(call.endpoint).toContain("search=математика")
    expect(call.endpoint).toContain("page=1")
    expect(store.getState().filters.examFilter).toEqual(SUBMITTED)
    expect(store.getState().pagination.examActivePage).toBe(1)
  })

  it("does not dispatch when the child filter submits the current values", async () => {
    const user = userEvent.setup()
    const state = makeState()
    state.filters.examFilter = { ...SUBMITTED }
    const { actions } = renderFilterContainer(state)
    await user.click(screen.getByRole("button", { name: "apply-filter" }))
    expect(actions).toEqual([])
  })
})
