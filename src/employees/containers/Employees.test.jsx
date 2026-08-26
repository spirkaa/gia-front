import { render, screen } from "@testing-library/react"
import { act } from "react"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import api from "../../middleware/api"
import rootReducer from "../../reducer"
import { makeState } from "../../test/fixtures"
import Employees from "./Employees"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const employeePage = () => ({
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: "e1",
      name: "Employee 1",
      org: { id: "o1", name: "Школа 1" },
      exams: [],
    },
  ],
})

const makeStore = () => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const store = createStore(
    rootReducer,
    makeState(),
    applyMiddleware(recording, thunk, api),
  )
  return { store, actions }
}

const renderEmployees = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/employees"]}>
        <HelmetProvider>
          <Employees />
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("Employees page", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(employeePage()) }),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fetches the first employees page on mount", async () => {
    const fetch = vi.mocked(globalThis.fetch)
    renderEmployees(makeStore().store)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe(
      "http://localhost:8000/api/v1/employee/?search=&page=1",
    )
    expect(fetch.mock.calls[0][1].method).toBe("GET")
    await act(async () => {})
  })

  it("shows a placeholder subheader before the data loads", async () => {
    renderEmployees(makeStore().store)
    expect(
      screen
        .getByRole("heading", { name: /Сотрудники, участвующие в ГИА/ })
        .querySelector("small"),
    ).toHaveTextContent("...")
    await act(async () => {})
  })

  it("renders the count, the employee row, the filter and the pagination on success", async () => {
    const { store } = makeStore()
    const { container } = renderEmployees(store)
    await screen.findByRole("link", { name: "Employee 1" })

    expect(
      screen
        .getByRole("heading", { name: /Сотрудники, участвующие в ГИА/ })
        .querySelector("small"),
    ).toHaveTextContent("1")
    expect(screen.getByRole("link", { name: "Employee 1" })).toHaveAttribute(
      "href",
      "/employees/detail/e1",
    )
    expect(screen.getByRole("link", { name: "Школа 1" })).toHaveAttribute(
      "href",
      "/organisations/detail/o1",
    )
    expect(screen.getByRole("button", { name: "Найти" })).toBeInTheDocument()
    expect(container.querySelector("ul.pagination")).not.toBeNull()
  })
})
