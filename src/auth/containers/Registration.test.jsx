import { render, screen } from "@testing-library/react"
import { act } from "react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
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
import Registration from "./Registration"

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

const renderRegistration = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/registration"]}>
        <HelmetProvider>
          <Registration />
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("Registration container", () => {
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

  it("renders the form with disabled submit and the login link", () => {
    renderRegistration(makeStore().store)
    expect(screen.getByRole("heading", { name: /Регистрация/ })).toBeInTheDocument()
    expect(screen.getByLabelText("Электронная почта")).toBeInTheDocument()
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument()
    expect(screen.getByLabelText("Повторите пароль")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Зарегистрироваться" })).toBeDisabled()
    expect(screen.getByRole("link", { name: "Войти" })).toHaveAttribute(
      "href",
      "/login",
    )
  })

  it("shows local email feedback on blur and keeps submit disabled", async () => {
    const user = userEvent.setup()
    renderRegistration(makeStore().store)
    await user.type(screen.getByLabelText("Электронная почта"), "not-an-email")
    await user.tab()
    expect(
      screen.getByText("Введите корректный адрес электронной почты."),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Зарегистрироваться" })).toBeDisabled()
  })

  it("submits the registration request", async () => {
    const user = userEvent.setup()
    const { store, actions } = makeStore()
    renderRegistration(store)
    await user.type(screen.getByLabelText("Электронная почта"), "i@i.ru")
    await user.type(screen.getByLabelText("Пароль"), "secret")
    await user.type(screen.getByLabelText("Повторите пароль"), "secret")
    await user.click(screen.getByRole("button", { name: "Зарегистрироваться" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([CALL_API])
    const call = actions[0][CALL_API]
    expect(call.endpoint).toBe("auth/registration/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({
      email: "i@i.ru",
      password1: "secret",
      password2: "secret",
    })
  })

  it("shows the server field errors as field feedback", async () => {
    const { store } = makeStore()
    renderRegistration(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_REG_FAILURE,
        payload: { email: ["bad email"], password1: ["too short"] },
      })
    })
    expect(await screen.findByText("bad email")).toBeInTheDocument()
    expect(await screen.findByText("too short")).toBeInTheDocument()
  })

  it("toasts the non-field errors from the server", async () => {
    const { store } = makeStore()
    renderRegistration(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_REG_FAILURE,
        payload: { non_field_errors: ["Регистрация невозможна"] },
      })
    })
    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Регистрация невозможна", {
        title: "Ошибка",
      }),
    )
  })

  it("clears the registration message on unmount", () => {
    const { store, actions } = makeStore()
    const { unmount } = renderRegistration(store)
    unmount()
    expect(actions).toEqual([{ type: c.AUTH_REG_MSG_CLEAR }])
  })
})
