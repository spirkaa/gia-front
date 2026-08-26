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
import Exams from "./Exams"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const examPage = () => ({
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: "x1",
      date: { id: "d1", date: "2025-06-01" },
      level: { id: "l1", level: "ГИА" },
      position: { id: "p1", name: "Председатель ППЭ" },
      place: {
        id: "pl1",
        code: "123",
        name: "Школа 1",
        addr: "ул. X, 1",
        ate: { id: "t1", name: "Центр" },
      },
      employee: {
        id: "e1",
        name: "Employee 1",
        org: { id: "o1", name: "Школа 1" },
        exams: [],
      },
    },
  ],
})

const datesPage = () => ({
  count: 1,
  next: null,
  previous: null,
  results: [{ id: "d1", date: "2025-06-01" }],
})

const levelsPage = () => ({
  count: 1,
  next: null,
  previous: null,
  results: [{ id: "l1", level: "ГИА" }],
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

const renderExams = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/exams"]}>
        <HelmetProvider>
          <Exams />
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("Exams page", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        const page = url.includes("/date/")
          ? datesPage()
          : url.includes("/level/")
            ? levelsPage()
            : examPage()
        return Promise.resolve({ ok: true, json: () => Promise.resolve(page) })
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fetches the exams page, the dates and the levels on mount", async () => {
    const fetch = vi.mocked(globalThis.fetch)
    renderExams(makeStore().store)
    expect(fetch).toHaveBeenCalledTimes(3)
    const urls = fetch.mock.calls.map((call) => call[0])
    expect(urls.some((url) => url.includes("/exam/") && url.includes("page=1"))).toBe(
      true,
    )
    expect(urls.some((url) => url.includes("/date/"))).toBe(true)
    expect(urls.some((url) => url.includes("/level/"))).toBe(true)
    await act(async () => {})
  })

  it("renders the header, the exam row and the filter on success", async () => {
    const { container } = renderExams(makeStore().store)
    await screen.findByRole("link", { name: "Employee 1" })

    expect(
      screen
        .getByRole("heading", { name: /Список организаторов ЕГЭ и ОГЭ/ })
        .querySelector("small"),
    ).toHaveTextContent("1")
    expect(screen.getByRole("link", { name: "Employee 1" })).toHaveAttribute(
      "href",
      "/employees/detail/e1",
    )
    expect(screen.getByText("Председатель ППЭ")).toBeInTheDocument()
    const mapLink = container.querySelector('a[title="Открыть карту"]')
    expect(mapLink).not.toBeNull()
    expect(mapLink.getAttribute("href")).toMatch(/^https:\/\/yandex\.ru\/maps\//)
    expect(container.querySelector("button#date")).not.toBeNull()
    expect(container.querySelector("button#level")).not.toBeNull()
    expect(screen.getByRole("button", { name: "Найти" })).toBeInTheDocument()
    expect(container.querySelector("ul.pagination")).not.toBeNull()
  })
})
