import { render, screen } from "@testing-library/react"
import { act } from "react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { toast } from "react-toastify"

import { CALL_API } from "../../middleware/api"
import api from "../../middleware/api"
import rootReducer from "../../reducer"
import { makeState } from "../../test/fixtures"
import * as c from "../constants"
import { AUTH_INITIAL_STATE } from "../reducer"
import RegistrationEmailConfirm from "./RegistrationEmailConfirm"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const makeStore = () => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const auth = { ...AUTH_INITIAL_STATE }
  const store = createStore(
    rootReducer,
    makeState({ auth }),
    applyMiddleware(recording, thunk, api),
  )
  return { store, actions }
}

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

const renderRegistrationEmailConfirm = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/registration/confirm-email/k1"]}>
        <HelmetProvider>
          <Routes>
            <Route
              path="/registration/confirm-email/:key"
              element={<RegistrationEmailConfirm />}
            />
            <Route path="/" element={<LocationProbe />} />
          </Routes>
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("RegistrationEmailConfirm container", () => {
  beforeEach(() => {
    toast.success.mockClear()
    toast.error.mockClear()
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("sends the verification request with the route key", async () => {
    const user = userEvent.setup()
    const { store, actions } = makeStore()
    renderRegistrationEmailConfirm(store)
    await user.click(screen.getByRole("button", { name: "Подтвердить адрес" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([CALL_API])
    const call = actions[0][CALL_API]
    expect(call.endpoint).toBe("auth/registration/verify-email/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({ key: "k1" })
  })

  it("toasts the confirmation and navigates home on success", async () => {
    const { store } = makeStore()
    renderRegistrationEmailConfirm(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_REG_VERIFY_MAIL_SUCCESS,
        payload: { detail: "ok" },
      })
    })
    expect(await screen.findByTestId("location")).toHaveTextContent("/")
    expect(toast.success).toHaveBeenCalledWith("Почтовый адрес подтвержден")
  })

  it("toasts the key error from the server", async () => {
    const { store } = makeStore()
    renderRegistrationEmailConfirm(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_REG_VERIFY_MAIL_FAILURE,
        payload: { key: ["Ключ недействителен"] },
      })
    })
    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Ключ недействителен", {
        title: "Ошибка",
      }),
    )
  })

  it("clears the verification message on unmount", () => {
    const { store, actions } = makeStore()
    const { unmount } = renderRegistrationEmailConfirm(store)
    unmount()
    expect(actions).toEqual([{ type: c.AUTH_REG_VERIFY_MAIL_MSG_CLEAR }])
  })
})
