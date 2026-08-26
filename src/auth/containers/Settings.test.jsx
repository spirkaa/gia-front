import { render, screen } from "@testing-library/react"
import { act } from "react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"
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
import Settings from "./Settings"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const state = () =>
  makeState({
    auth: {
      ...AUTH_INITIAL_STATE,
      token: "jwt",
      user: { email: "i@i.ru", first_name: "Олег", last_name: "Смирнов" },
    },
  })

const makeStore = () => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const store = createStore(
    rootReducer,
    state(),
    applyMiddleware(recording, thunk, api),
  )
  return { store, actions }
}

const renderSettings = (store) =>
  render(
    <Provider store={store}>
      <HelmetProvider>
        <Settings />
      </HelmetProvider>
    </Provider>,
  )

describe("Settings container", () => {
  beforeEach(() => {
    toast.success.mockClear()
    toast.error.mockClear()
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("loads the profile on mount and fills the name fields", () => {
    const { store, actions } = makeStore()
    renderSettings(store)

    expect(actions.map((a) => a.type || CALL_API)).toEqual([CALL_API])
    const call = actions[0][CALL_API]
    expect(call.endpoint).toBe("auth/user/")
    expect(call.method).toBe("GET")
    expect(call.data).toEqual({ jwt: "jwt" })
    expect(screen.getByLabelText("Имя")).toHaveValue("Олег")
    expect(screen.getByLabelText("Фамилия")).toHaveValue("Смирнов")
  })

  it("re-syncs the name fields when the user is updated", async () => {
    const { store } = makeStore()
    renderSettings(store)

    act(() => {
      store.dispatch({
        type: c.AUTH_INFO_SUCCESS,
        payload: { email: "i@i.ru", first_name: "Новый", last_name: "Фам" },
      })
    })
    await vi.waitFor(() => {
      expect(screen.getByLabelText("Имя")).toHaveValue("Новый")
      expect(screen.getByLabelText("Фамилия")).toHaveValue("Фам")
    })
  })

  it("submits the name update", async () => {
    const user = userEvent.setup()
    const { store, actions } = makeStore()
    renderSettings(store)
    await user.clear(screen.getByLabelText("Имя"))
    await user.type(screen.getByLabelText("Имя"), "Анна")
    await user.clear(screen.getByLabelText("Фамилия"))
    await user.type(screen.getByLabelText("Фамилия"), "Иванова")
    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([CALL_API, CALL_API])
    const call = actions[1][CALL_API]
    expect(call.endpoint).toBe("auth/user/")
    expect(call.method).toBe("PATCH")
    expect(call.data).toEqual({ jwt: "jwt", first_name: "Анна", last_name: "Иванова" })
  })

  it("opens the password modal on button click", async () => {
    const user = userEvent.setup()
    const { store } = makeStore()
    renderSettings(store)
    await user.click(screen.getByRole("button", { name: "Изменить пароль" }))
    expect(store.getState().auth.showModal).toBe(true)
  })

  it("toasts an expired session and logs out", async () => {
    const { store, actions } = makeStore()
    renderSettings(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_INFO_UPDATE_FAILURE,
        payload: { detail: "Signature has expired." },
      })
    })
    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Требуется повторный вход", {
        title: "Сессия истекла",
      }),
    )
    expect(actions.some((a) => a.type === c.AUTH_LOGOUT)).toBe(true)
  })

  it("toasts the success detail", async () => {
    const { store } = makeStore()
    renderSettings(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_INFO_UPDATE_SUCCESS,
        payload: { email: "i@i.ru", first_name: "Олег", last_name: "Смирнов" },
      })
    })
    await vi.waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Настройки успешно обновлены"),
    )
  })

  it("toasts the non-field errors from the server", async () => {
    const { store } = makeStore()
    renderSettings(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_INFO_UPDATE_FAILURE,
        payload: { non_field_errors: ["err"] },
      })
    })
    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("err", { title: "Ошибка" }),
    )
  })

  it("clears the update message on unmount", () => {
    const { store, actions } = makeStore()
    const { unmount } = renderSettings(store)
    unmount()
    expect(actions.map((a) => a.type || CALL_API)).toEqual([
      CALL_API,
      c.AUTH_INFO_UPDATE_MSG_CLEAR,
      c.AUTH_PASSWORD_CHANGE_MSG_CLEAR,
    ])
  })
})
