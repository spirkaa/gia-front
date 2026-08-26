import { render, screen } from "@testing-library/react"
import { act } from "react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { toast } from "react-toastify"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import api from "../../middleware/api"
import rootReducer from "../../reducer"
import { makeState } from "../../test/fixtures"
import * as c from "../../subscriptions/constants"
import EmployeeDetail from "./EmployeeDetail"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const detailJson = () => ({
  id: "e1",
  name: "Employee 1",
  org: { id: "o1", name: "Школа 1" },
  exams: [
    {
      id: "x1",
      date: { id: "d1", date: "2025-06-01" },
      level: { id: "l1", level: "ГИА" },
      position: { id: "p1", name: "Председатель ППЭ" },
      place: {
        id: "pl1",
        code: "123",
        name: "Гимназия 5",
        addr: "ул. X, 1",
        ate: { id: "t1", name: "Центр" },
      },
      employee: "e1",
    },
  ],
})

const subsState = (extra = {}) => ({
  subsMsg: {},
  isSubRequesting: false,
  isSubAddRequesting: false,
  isSubAddRequested: false,
  isSubDelRequesting: false,
  isSubDelRequested: false,
  ...extra,
})

const makeStore = (overrides = {}) => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const store = createStore(
    rootReducer,
    makeState({ ...overrides, subs: { ...subsState(), ...overrides.subs } }),
    applyMiddleware(recording, thunk, api),
  )
  return { store, actions }
}

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

const renderDetail = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/employees/detail/e1"]}>
        <HelmetProvider>
          <Routes>
            <Route path="/employees/detail/:employeeId" element={<EmployeeDetail />} />
            <Route path="*" element={<LocationProbe />} />
          </Routes>
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

const waitForDetail = () =>
  screen.findByRole("button", { name: "Подписаться на обновления" })

describe("EmployeeDetail", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve(url.includes("/employee/e1/") ? detailJson() : {}),
        }),
      ),
    )
    vi.mocked(toast.error).mockClear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fetches the employee detail on mount", async () => {
    const fetch = vi.mocked(globalThis.fetch)
    renderDetail(makeStore().store)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe("http://localhost:8000/api/v1/employee/e1/")
    expect(fetch.mock.calls[0][1].method).toBe("GET")
    await act(async () => {})
  })

  it("shows a loading state before the detail arrives", async () => {
    renderDetail(makeStore().store)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
    await act(async () => {})
  })

  it("renders the name, the organisation link and the exams on success", async () => {
    const { container } = renderDetail(makeStore().store)
    await waitForDetail()

    const heading = screen.getByRole("heading", { name: /Employee 1/ })
    expect(screen.getByRole("link", { name: "Школа 1" }).closest("h1")).toBe(heading)
    expect(screen.getByRole("link", { name: "Школа 1" })).toHaveAttribute(
      "href",
      "/organisations/detail/o1",
    )
    expect(screen.getByText("Председатель ППЭ")).toBeInTheDocument()
    expect(screen.getByText("ГИА")).toBeInTheDocument()
    const mapLink = container.querySelector('a[title="Открыть карту"]')
    expect(mapLink).not.toBeNull()
    expect(mapLink.getAttribute("href")).toMatch(/^https:\/\/yandex\.ru\/maps\//)
  })

  it("subscribes an authenticated user and navigates to subscriptions", async () => {
    const fetch = vi.mocked(globalThis.fetch)
    renderDetail(makeStore({ auth: { token: "jwt" } }).store)
    await userEvent.setup().click(await waitForDetail())

    expect(fetch).toHaveBeenCalledTimes(2)
    const [url, options] = fetch.mock.calls[1]
    expect(url).toBe("http://localhost:8000/api/v1/subscription/")
    expect(options.method).toBe("POST")
    expect(JSON.parse(options.body)).toEqual({ jwt: "jwt", employee: "e1" })
    expect(await screen.findByTestId("location")).toHaveTextContent("/subscriptions")
  })

  it("navigates to registration when the user has no token", async () => {
    const fetch = vi.mocked(globalThis.fetch)
    renderDetail(makeStore().store)
    await userEvent.setup().click(await waitForDetail())

    expect(await screen.findByTestId("location")).toHaveTextContent("/registration")
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it("navigates to subscriptions when the add was already requested", async () => {
    renderDetail(makeStore({ subs: { isSubAddRequested: true } }).store)
    expect(await screen.findByTestId("location")).toHaveTextContent("/subscriptions")
  })

  it("toasts the non-field errors when the add fails", async () => {
    const { store } = makeStore()
    renderDetail(store)
    await waitForDetail()

    act(() => {
      store.dispatch({
        type: c.SUBS_ADD_FAILURE,
        payload: { non_field_errors: ["err"] },
      })
    })
    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("err", { title: "Ошибка" }),
    )
  })

  it("disables the subscribe button while the add is in flight", async () => {
    renderDetail(makeStore({ subs: { isSubAddRequesting: true } }).store)
    expect(
      await screen.findByRole("button", { name: "Пожалуйста, подождите..." }),
    ).toBeDisabled()
  })
})
