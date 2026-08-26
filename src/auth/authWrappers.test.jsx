import { render, screen } from "@testing-library/react"
import { act } from "react"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { toast } from "react-toastify"
import { beforeEach, describe, expect, it, vi } from "vitest"

import rootReducer from "../reducer"
import { AUTH_LOGIN_REQUEST, AUTH_TOKEN_CHECK_SUCCESS } from "./constants"
import { Authenticated, NotAuthenticated } from "./authWrappers"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

vi.mock("./containers", () => ({
  Login: () => "login-stub",
}))

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

const makeStore = () => createStore(rootReducer, applyMiddleware(thunk))

// The guard is mounted as a real route, mirroring src/routes.jsx, so that
// navigating away unmounts it (as the router does in the real app).
const renderGuard = (guard, initialEntries, guardPath = "/login") => {
  const store = makeStore()
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <LocationProbe />
        <Routes>
          <Route path={guardPath} element={guard} />
          <Route path="*" element={null} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
  return store
}

const authenticate = async (store) => {
  await act(async () => {
    store.dispatch({
      type: AUTH_TOKEN_CHECK_SUCCESS,
      payload: { access: "token", user: { email: "i@i.ru" } },
    })
  })
}

describe("Authenticated", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders children when already authenticated", () => {
    const store = makeStore()
    store.dispatch({
      type: AUTH_TOKEN_CHECK_SUCCESS,
      payload: { access: "token", user: { email: "i@i.ru" } },
    })
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Authenticated>
            <div>secret content</div>
          </Authenticated>
        </MemoryRouter>
      </Provider>,
    )
    expect(screen.getByText("secret content")).toBeInTheDocument()
  })

  it("renders children while authentication is in progress", () => {
    const store = makeStore()
    store.dispatch({ type: AUTH_LOGIN_REQUEST })
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Authenticated>
            <div>secret content</div>
          </Authenticated>
        </MemoryRouter>
      </Provider>,
    )
    expect(screen.getByText("secret content")).toBeInTheDocument()
  })

  it("redirects guests to /login", () => {
    renderGuard(
      <Authenticated>
        <div>secret content</div>
      </Authenticated>,
      ["/protected"],
      "/protected",
    )
    expect(screen.queryByText("secret content")).not.toBeInTheDocument()
    expect(screen.getByTestId("location")).toHaveTextContent("/login")
  })
})

describe("NotAuthenticated", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders children for guests", () => {
    renderGuard(
      <NotAuthenticated>
        <div>public content</div>
      </NotAuthenticated>,
      ["/login"],
    )
    expect(screen.getByText("public content")).toBeInTheDocument()
  })

  it("renders the login form while authentication is in progress", () => {
    const store = makeStore()
    store.dispatch({ type: AUTH_LOGIN_REQUEST })
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <NotAuthenticated>
            <div>public content</div>
          </NotAuthenticated>
        </MemoryRouter>
      </Provider>,
    )
    expect(screen.getByText("login-stub")).toBeInTheDocument()
  })

  it("hides children, greets and navigates to /subscriptions when authenticated", async () => {
    const store = renderGuard(
      <NotAuthenticated>
        <div>public content</div>
      </NotAuthenticated>,
      ["/login"],
    )
    await authenticate(store)
    expect(screen.queryByText("public content")).not.toBeInTheDocument()
    expect(screen.getByTestId("location")).toHaveTextContent("/subscriptions")
    expect(toast.success).toHaveBeenCalledWith("Добро пожаловать!", {
      title: "Вход выполнен",
    })
  })

  it("navigates to the ?redirect= target when authenticated", async () => {
    const store = renderGuard(
      <NotAuthenticated>
        <div>public content</div>
      </NotAuthenticated>,
      ["/login?redirect=/places"],
    )
    await authenticate(store)
    expect(screen.getByTestId("location")).toHaveTextContent("/places")
  })
})
