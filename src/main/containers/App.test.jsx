import { render, screen, waitFor } from "@testing-library/react"
import { act } from "react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import api from "../../middleware/api"
import rootReducer from "../../reducer"
import { App } from "./App"

const emptyPage = { count: 0, next: null, previous: null, results: [] }

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const year = new Date().getFullYear()

const metaDescription =
  "Список организаторов ППЭ Москвы, " +
  "задействованных при проведении ЕГЭ и ОГЭ. " +
  "Удобный поиск информации о распределении сотрудников " +
  "образовательных организаций в ППЭ (пункты проведения экзаменов). ГИА в Москве"

const renderApp = () => {
  const store = createStore(rootReducer, applyMiddleware(thunk, api))
  return render(
    <HelmetProvider>
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    </HelmetProvider>,
  )
}

describe("App", () => {
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

  it("renders the nav, disclaimer, home content and footer", async () => {
    renderApp()
    expect(screen.getByRole("link", { name: `ГИА ${year} в Москве` })).toHaveAttribute(
      "href",
      "/",
    )
    expect(
      screen.getByRole("heading", { name: "Отказ от ответственности" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 1, name: "Список организаторов ППЭ" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "devmem.ru" })).toBeInTheDocument()
    await act(async () => {})
  })

  it("sets the document title and meta description", async () => {
    renderApp()
    await waitFor(() => expect(document.title).toBe(`ГИА ${year} в Москве`))
    expect(document.querySelector('meta[name="description"]').content).toBe(
      metaDescription,
    )
  })
})
