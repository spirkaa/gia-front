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
import PasswordReset from "./PasswordReset"

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

const renderPasswordReset = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/password-reset"]}>
        <HelmetProvider>
          <Routes>
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="*" element={<LocationProbe />} />
          </Routes>
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("PasswordReset container", () => {
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

  it("renders the form with disabled submit for an empty email", () => {
    renderPasswordReset(makeStore().store)
    expect(
      screen.getByRole("heading", { name: /Восстановление пароля/ }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Электронная почта")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Восстановить пароль" })).toBeDisabled()
  })

  it("shows local email feedback on blur and keeps submit disabled", async () => {
    const user = userEvent.setup()
    renderPasswordReset(makeStore().store)
    await user.type(screen.getByLabelText("Электронная почта"), "not-an-email")
    await user.tab()
    expect(
      screen.getByText("Введите корректный адрес электронной почты."),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Восстановить пароль" })).toBeDisabled()
  })

  it("submits the reset request for a valid email", async () => {
    const user = userEvent.setup()
    const { store, actions } = makeStore()
    renderPasswordReset(store)
    await user.type(screen.getByLabelText("Электронная почта"), "i@i.ru")
    await user.click(screen.getByRole("button", { name: "Восстановить пароль" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([CALL_API])
    const call = actions[0][CALL_API]
    expect(call.endpoint).toBe("auth/password/reset/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({ email: "i@i.ru" })
  })

  it("toasts the detail and navigates to the email-sent page", async () => {
    const { store } = makeStore()
    renderPasswordReset(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_PASSWORD_RESET_SUCCESS,
        payload: { detail: "Ссылка отправлена" },
      })
    })
    expect(await screen.findByTestId("location")).toHaveTextContent(
      "/password-reset/email-sent",
    )
    expect(toast.success).toHaveBeenCalledWith("Ссылка отправлена")
  })

  it("shows the server email error as field feedback", async () => {
    const { store } = makeStore()
    renderPasswordReset(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_PASSWORD_RESET_FAILURE,
        payload: { email: ["no such user"] },
      })
    })
    expect(await screen.findByText("no such user")).toBeInTheDocument()
  })

  it("clears the password reset message on unmount", () => {
    const { store, actions } = makeStore()
    const { unmount } = renderPasswordReset(store)
    unmount()
    expect(actions).toEqual([{ type: c.AUTH_PASSWORD_RESET_MSG_CLEAR }])
  })
})
