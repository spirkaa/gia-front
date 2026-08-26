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
import Places from "./Places"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const placesPage = () => ({
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: "pl1",
      code: "123",
      name: "Школа 1",
      addr: "ул. X, 1",
      ate: { id: "t1", name: "Центр" },
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

const renderPlaces = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/places"]}>
        <HelmetProvider>
          <Places />
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("Places page", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(placesPage()) }),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fetches the first places page on mount", async () => {
    const fetch = vi.mocked(globalThis.fetch)
    renderPlaces(makeStore().store)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe(
      "http://localhost:8000/api/v1/place/?search=&page=1",
    )
    expect(fetch.mock.calls[0][1].method).toBe("GET")
    await act(async () => {})
  })

  it("renders the count, the place row with the map link and the filter on success", async () => {
    const { store } = makeStore()
    const { container } = renderPlaces(store)
    await screen.findByText((content, element) =>
      element.tagName === "DIV"
        ? element.textContent.startsWith("№123: Школа 1")
        : false,
    )

    expect(
      screen.getByRole("heading", { name: /Список ППЭ/ }).querySelector("small"),
    ).toHaveTextContent("1")
    expect(screen.getByText("ул. X, 1")).toBeInTheDocument()
    const mapLink = container.querySelector('a[title="Открыть карту"]')
    expect(mapLink).not.toBeNull()
    expect(mapLink.getAttribute("href")).toMatch(/^https:\/\/yandex\.ru\/maps\//)
    expect(screen.getByRole("button", { name: "Найти" })).toBeInTheDocument()
    expect(container.querySelector("ul.pagination")).not.toBeNull()
  })
})
