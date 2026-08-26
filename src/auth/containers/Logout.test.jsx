import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { toast } from "react-toastify"

import rootReducer from "../../reducer"
import { makeState } from "../../test/fixtures"
import * as c from "../constants"
import { AUTH_INITIAL_STATE } from "../reducer"
import Logout from "./Logout"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const makeStore = (state) => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const store = createStore(rootReducer, state, applyMiddleware(recording, thunk))
  return { store, actions }
}

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

const renderLogout = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/logout"]}>
        <Routes>
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe("Logout container", () => {
  beforeEach(() => {
    toast.success.mockClear()
    toast.error.mockClear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
    sessionStorage.clear()
  })

  it("logs out an authenticated user, toasts and navigates home", async () => {
    localStorage.setItem("token", "jwt")
    const state = makeState({
      auth: {
        ...AUTH_INITIAL_STATE,
        token: "jwt",
        user: { email: "i@i.ru" },
        isAuthenticated: true,
      },
    })
    const { store, actions } = makeStore(state)
    renderLogout(store)

    expect(await screen.findByTestId("location")).toHaveTextContent("/")
    expect(actions).toEqual([{ type: c.AUTH_LOGOUT }])
    expect(toast.success).toHaveBeenCalledWith("Сессия завершена", {
      title: "Выход выполнен",
    })
    expect(localStorage.getItem("token")).toBeNull()
  })

  it("navigates home without logging out a guest", async () => {
    const { store, actions } = makeStore(makeState({ auth: { ...AUTH_INITIAL_STATE } }))
    renderLogout(store)

    expect(await screen.findByTestId("location")).toHaveTextContent("/")
    expect(actions).toEqual([])
    expect(toast.success).not.toHaveBeenCalled()
  })

  it("dispatches logout exactly once across re-renders", async () => {
    const state = makeState({
      auth: {
        ...AUTH_INITIAL_STATE,
        token: "jwt",
        user: { email: "i@i.ru" },
        isAuthenticated: true,
      },
    })
    const { store, actions } = makeStore(state)
    renderLogout(store)

    await screen.findByTestId("location")
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(actions.filter((a) => a.type === c.AUTH_LOGOUT)).toHaveLength(1)
  })
})
