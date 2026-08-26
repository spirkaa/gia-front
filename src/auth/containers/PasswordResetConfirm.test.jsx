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
import PasswordResetConfirm from "./PasswordResetConfirm"

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

const renderPasswordResetConfirm = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/password-reset/confirm/u1/t1"]}>
        <HelmetProvider>
          <Routes>
            <Route
              path="/password-reset/confirm/:uid/:token"
              element={<PasswordResetConfirm />}
            />
            <Route path="*" element={<LocationProbe />} />
          </Routes>
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("PasswordResetConfirm container", () => {
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

  it("renders the form with disabled submit for empty passwords", () => {
    renderPasswordResetConfirm(makeStore().store)
    expect(
      screen.getByRole("heading", { name: /Восстановление пароля/ }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Новый пароль")).toBeInTheDocument()
    expect(screen.getByLabelText("Повторите пароль")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled()
  })

  it("submits the confirmation with the route uid and token", async () => {
    const user = userEvent.setup()
    const { store, actions } = makeStore()
    renderPasswordResetConfirm(store)
    await user.type(screen.getByLabelText("Новый пароль"), "new1")
    await user.type(screen.getByLabelText("Повторите пароль"), "new2")
    await user.click(screen.getByRole("button", { name: "Отправить" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([CALL_API])
    const call = actions[0][CALL_API]
    expect(call.endpoint).toBe("auth/password/reset/confirm/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({
      uid: "u1",
      token: "t1",
      new_password1: "new1",
      new_password2: "new2",
    })
  })

  it("toasts the detail and navigates to login", async () => {
    const { store } = makeStore()
    renderPasswordResetConfirm(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_PASSWORD_RESET_CONFIRM_SUCCESS,
        payload: { detail: "Пароль изменен" },
      })
    })
    expect(await screen.findByTestId("location")).toHaveTextContent("/login")
    expect(toast.success).toHaveBeenCalledWith("Пароль изменен")
  })

  it("shows the server field errors as field feedback", async () => {
    const { store } = makeStore()
    renderPasswordResetConfirm(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_PASSWORD_RESET_CONFIRM_FAILURE,
        payload: { new_password1: ["too short"] },
      })
    })
    expect(await screen.findByText("too short")).toBeInTheDocument()
  })

  it("clears the confirm message on unmount", () => {
    const { store, actions } = makeStore()
    const { unmount } = renderPasswordResetConfirm(store)
    unmount()
    expect(actions).toEqual([{ type: c.AUTH_PASSWORD_RESET_CONFIRM_MSG_CLEAR }])
  })
})
