import { render, screen } from "@testing-library/react"
import { act } from "react"
import { MemoryRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  AUTH_REMEMBER,
  AUTH_TOKEN_CHECK_SUCCESS,
  AUTH_TOKEN_SAVE,
} from "../../auth/constants"
import api, { CALL_API } from "../../middleware/api"
import rootReducer from "../../reducer"
import NavContainer from "./NavContainer"

const year = new Date().getFullYear()

const emptyPage = { count: 0, next: null, previous: null, results: [] }

const makeStore = (actions) => {
  const recording = () => (next) => (action) => {
    actions.push(action)
    return next(action)
  }
  return createStore(rootReducer, applyMiddleware(recording, thunk, api))
}

const renderNav = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <NavContainer />
      </MemoryRouter>
    </Provider>,
  )

const authenticate = (store) =>
  store.dispatch({
    type: AUTH_TOKEN_CHECK_SUCCESS,
    payload: { access: "token", user: { email: "i@i.ru" } },
  })

describe("NavContainer", () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
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

  it("loads the data sources on mount and shows the guest nav", async () => {
    const actions = []
    renderNav(makeStore(actions))

    expect(screen.getByRole("link", { name: `ГИА ${year} в Москве` })).toHaveAttribute(
      "href",
      "/",
    )
    expect(screen.getByRole("link", { name: "Вход" })).toHaveAttribute("href", "/login")

    const callApi = actions.find((action) => action[CALL_API])
    expect(callApi).toBeDefined()
    expect(callApi[CALL_API].endpoint).toBe("datasource/")
    expect(callApi[CALL_API].method).toBe("GET")
    await act(async () => {})
  })

  it("shows the email dropdown instead of the login link when authenticated", async () => {
    const store = makeStore([])
    authenticate(store)
    renderNav(store)

    expect(screen.getByRole("button", { name: "i@i.ru" })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Вход" })).not.toBeInTheDocument()
    await act(async () => {})
  })

  it("persists the token to localStorage when rememberMe is enabled", async () => {
    const actions = []
    const store = makeStore(actions)
    authenticate(store)
    renderNav(store)

    await act(async () => {
      store.dispatch({ type: AUTH_REMEMBER, payload: true })
    })

    expect(localStorage.getItem("token")).toBe("token")
    expect(
      actions.some(
        (action) => action.type === AUTH_TOKEN_SAVE && action.payload === "token",
      ),
    ).toBe(true)
  })
})
