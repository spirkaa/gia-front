import { render, screen, waitFor } from "@testing-library/react"
import { act } from "react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
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
import SettingsPassword from "./SettingsPassword"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const makeStore = (
  state = makeState({ auth: { ...AUTH_INITIAL_STATE, token: "jwt", showModal: true } }),
) => {
  const actions = []
  const recording = () => (next) => (action) => {
    if (typeof action !== "function") actions.push(action)
    return next(action)
  }
  const store = createStore(rootReducer, state, applyMiddleware(recording, thunk, api))
  return { store, actions }
}

const renderSettingsPassword = (store) =>
  render(
    <Provider store={store}>
      <SettingsPassword />
    </Provider>,
  )

describe("SettingsPassword container", () => {
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

  it("is hidden by default", () => {
    renderSettingsPassword(
      makeStore(makeState({ auth: { ...AUTH_INITIAL_STATE } })).store,
    )
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("shows the form with disabled submit for empty fields", () => {
    renderSettingsPassword(makeStore().store)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Изменить пароль")).toBeInTheDocument()
    expect(screen.getByLabelText("Старый пароль")).toBeInTheDocument()
    expect(screen.getByLabelText("Новый пароль")).toBeInTheDocument()
    expect(screen.getByLabelText("Повторите пароль")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Сохранить" })).toBeDisabled()
  })

  it("submits the password change request", async () => {
    const user = userEvent.setup()
    const { store, actions } = makeStore()
    renderSettingsPassword(store)
    await user.type(screen.getByLabelText("Старый пароль"), "old")
    await user.type(screen.getByLabelText("Новый пароль"), "new1")
    await user.type(screen.getByLabelText("Повторите пароль"), "new2")
    await user.click(screen.getByRole("button", { name: "Сохранить" }))

    expect(actions.map((a) => a.type || CALL_API)).toEqual([CALL_API])
    const call = actions[0][CALL_API]
    expect(call.endpoint).toBe("auth/password/change/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({
      jwt: "jwt",
      old_password: "old",
      new_password1: "new1",
      new_password2: "new2",
    })
  })

  it("toasts an expired session and logs out", async () => {
    const { store, actions } = makeStore()
    renderSettingsPassword(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_PASSWORD_CHANGE_FAILURE,
        payload: { detail: "Signature has expired." },
      })
    })
    await vi.waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Требуется вход", {
        title: "Сессия истекла",
      }),
    )
    expect(actions.some((a) => a.type === c.AUTH_LOGOUT)).toBe(true)
  })

  it("toasts the success detail and closes the modal", async () => {
    const { store } = makeStore()
    renderSettingsPassword(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_PASSWORD_CHANGE_SUCCESS,
        payload: { detail: "Пароль успешно изменен" },
      })
    })
    await vi.waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Пароль успешно изменен"),
    )
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })

  it("shows the server field errors as field feedback", async () => {
    const { store } = makeStore()
    renderSettingsPassword(store)
    act(() => {
      store.dispatch({
        type: c.AUTH_PASSWORD_CHANGE_FAILURE,
        payload: { old_password: ["Старый пароль неверный"] },
      })
    })
    expect(await screen.findByText("Старый пароль неверный")).toBeInTheDocument()
  })

  it("clears the password change message on unmount", () => {
    const { store, actions } = makeStore()
    const { unmount } = renderSettingsPassword(store)
    unmount()
    expect(actions).toEqual([{ type: c.AUTH_PASSWORD_CHANGE_MSG_CLEAR }])
  })
})
