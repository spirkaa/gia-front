import { render, screen } from "@testing-library/react"
import { act } from "react"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import api from "../../middleware/api"
import rootReducer from "../../reducer"
import Root from "./Root"

const emptyPage = { count: 0, next: null, previous: null, results: [] }

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const year = new Date().getFullYear()

describe("Root", () => {
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

  it("renders the app shell with nav, disclaimer, home content and footer", async () => {
    const store = createStore(rootReducer, applyMiddleware(thunk, api))
    render(<Root store={store} />)

    expect(screen.getByRole("link", { name: `ГИА ${year} в Москве` })).toHaveAttribute(
      "href",
      "/",
    )
    expect(
      screen.getByRole("heading", { level: 1, name: "Список организаторов ППЭ" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Отказ от ответственности" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "devmem.ru" })).toBeInTheDocument()
    await act(async () => {})
  })
})
