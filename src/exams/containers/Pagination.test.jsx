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
import { EXAMS_PAGE_SET } from "../actions"
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
  const { container } = render(
    <Provider store={store}>
      <Pagination />
    </Provider>,
  )
  return { actions, store, container }
}

describe("exams Pagination container", () => {
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

  it("dispatches page set and load on page click", async () => {
    const user = userEvent.setup()
    const state = makeState({
      entities: { examPage: { 1: { count: 150, results: [] } } },
    })
    const { actions, store } = renderPagination(state)
    await user.click(screen.getByText("2"))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([EXAMS_PAGE_SET, CALL_API])
    expect(actions[0].payload).toBe(2)
    const call = actions[1][CALL_API]
    expect(call.endpoint).toContain("page=2")
    expect(store.getState().pagination.examActivePage).toBe(2)
  })

  it("does not dispatch when the active page is clicked", async () => {
    const user = userEvent.setup()
    const state = makeState({
      entities: { examPage: { 1: { count: 150, results: [] } } },
    })
    const { actions, container } = renderPagination(state)
    await user.click(container.querySelector("li.page-item.active .page-link"))
    expect(actions).toEqual([])
  })
})
