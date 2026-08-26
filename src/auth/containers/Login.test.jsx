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
import Login from "./Login"

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

const renderLogin = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <HelmetProvider>
          <Login />
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

describe("Login container", () => {
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

  it("renders the form with remember-me checked, disabled submit and links", () => {
    renderLogin(makeStore().store)
    expect(screen.getByRole("heading", { name: /Вход/ })).toBeInTheDocument()
    expect(screen.getByLabelText("Электронная почта")).toBeInTheDocument()
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument()
    expect(screen.getByText("Запомнить")).toBeInTheDocument()
    expect(screen.getByRole("checkbox")).toBeChecked()
    expect(screen.getByRole("button", { name: "Войти" })).toBeDisabled()
    expect(screen.getByRole("link", { name: "Забыли пароль?" })).toHaveAttribute(
      "href",
      "/password-reset",
    )
    expect(screen.getByRole("link", { name: "Регистрация" })).toHaveAttribute(
      "href",
      "/registration",
    )
  })

  it("shows local email feedback on blur and keeps submit disabled", async () => {
    const user = userEvent.setup()
    renderLogin(makeStore().store)
    await user.type(screen.getByLabelText("Электронная почта"), "not-an-email")
    await user.tab()
    expect(
      screen.getByText("Введите корректный адрес электронной почты."),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Войти" })).toBeDisabled()
  })

  it("shows empty password feedback once the password field is touched", async () => {
    const user = userEvent.setup()
    renderLogin(makeStore().store)
    await user.type(screen.getByLabelText("Электронная почта"), "i@i.ru")
    await user.tab()
    await user.tab()
    expect(screen.getByText("Пароль не может быть пустым.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Войти" })).toBeDisabled()
  })

  it("submits the credentials and the default remember-me state", async () => {
    const user = userEvent.setup()
    const { store, actions } = makeStore()
    renderLogin(store)
    await user.type(screen.getByLabelText("Электронная почта"), "i@i.ru")
    await user.type(screen.getByLabelText("Пароль"), "secret")
    await user.click(screen.getByRole("button", { name: "Войти" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([CALL_API, c.AUTH_REMEMBER])
    const call = actions[0][CALL_API]
    expect(call.endpoint).toBe("auth/login/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({ email: "i@i.ru", password: "secret" })
    expect(actions[1].payload).toBe(true)
  })

  it("sends remember-me false when the checkbox is unchecked", async () => {
    const user = userEvent.setup()
    const { store, actions } = makeStore()
    renderLogin(store)
    await user.click(screen.getByRole("checkbox"))
    await user.type(screen.getByLabelText("Электронная почта"), "i@i.ru")
    await user.type(screen.getByLabelText("Пароль"), "secret")
    await user.click(screen.getByRole("button", { name: "Войти" }))

    expect(actions.filter((a) => a.type === c.AUTH_REMEMBER)).toEqual([
      { type: c.AUTH_REMEMBER, payload: false },
    ])
  })

  it("shows the server email error as field feedback", async () => {
    const { store } = makeStore()
    renderLogin(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_LOGIN_FAILURE,
        payload: { email: ["Введите email"] },
      })
    })
    expect(await screen.findByText("Введите email")).toBeInTheDocument()
  })

  it("toasts the non-field errors from the server", async () => {
    const { store } = makeStore()
    renderLogin(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_LOGIN_FAILURE,
        payload: { non_field_errors: ["Неверные учетные данные"] },
      })
    })
    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Неверные учетные данные", {
        title: "Ошибка",
      }),
    )
  })

  it("clears the login message on unmount", () => {
    const { store, actions } = makeStore()
    const { unmount } = renderLogin(store)
    unmount()
    expect(actions).toEqual([{ type: c.AUTH_LOGIN_MSG_CLEAR }])
  })
})
