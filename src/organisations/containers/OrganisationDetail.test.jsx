import { render, screen } from "@testing-library/react"
import { act } from "react"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import api from "../../middleware/api"
import rootReducer from "../../reducer"
import { makeState } from "../../test/fixtures"
import OrganisationDetail from "./OrganisationDetail"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const orgDetailJson = () => ({
  id: "o1",
  name: "Школа 1",
  employees: [
    { id: "e1", name: "Employee 1", org: "o1", exams: [] },
    { id: "e2", name: "Employee 2", org: "o1", exams: [] },
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

const renderDetail = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/organisations/detail/o1"]}>
        <HelmetProvider>
          <Routes>
            <Route
              path="/organisations/detail/:orgId"
              element={<OrganisationDetail />}
            />
          </Routes>
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("OrganisationDetail", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve(url.includes("/organisation/o1/") ? orgDetailJson() : {}),
        }),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fetches the organisation detail on mount", async () => {
    const fetch = vi.mocked(globalThis.fetch)
    renderDetail(makeStore().store)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe("http://localhost:8000/api/v1/organisation/o1/")
    expect(fetch.mock.calls[0][1].method).toBe("GET")
    await act(async () => {})
  })

  it("shows a loading state before the detail arrives", async () => {
    renderDetail(makeStore().store)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
    await act(async () => {})
  })

  it("renders the name, the subheader and the employees on success", async () => {
    renderDetail(makeStore().store)
    await screen.findByRole("link", { name: "Employee 1" })

    const heading = screen.getByRole("heading", { name: /Школа 1/ })
    expect(heading.querySelector("small")).toHaveTextContent(
      "Работники ППЭ от организации",
    )
    expect(screen.getByRole("link", { name: "Employee 1" })).toHaveAttribute(
      "href",
      "/employees/detail/e1",
    )
    expect(screen.getByRole("link", { name: "Employee 2" })).toHaveAttribute(
      "href",
      "/employees/detail/e2",
    )
  })
})
