import { render, screen } from "@testing-library/react"
import { act } from "react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter, useLocation } from "react-router-dom"
import { Provider } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import api from "./middleware/api"
import rootReducer from "./reducer"
import Routes from "./routes"

const emptyPage = { count: 0, next: null, previous: null, results: [] }

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

const renderRoute = (path) => {
  const store = createStore(rootReducer, applyMiddleware(thunk, api))
  return render(
    <HelmetProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <LocationProbe />
          <Routes />
        </MemoryRouter>
      </Provider>
    </HelmetProvider>,
  )
}

describe("Routes", () => {
  beforeEach(() => {
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

  it("renders the home page at /", () => {
    renderRoute("/")
    expect(
      screen.getByRole("heading", { level: 1, name: "Список организаторов ППЭ" }),
    ).toBeInTheDocument()
  })

  it("renders the about page at /about", () => {
    renderRoute("/about")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("О сайте")
  })

  it("renders the not found page for unknown paths", () => {
    renderRoute("/nope")
    expect(screen.getByText(/Страница не найдена/)).toBeInTheDocument()
  })

  it("renders the login form at /login", () => {
    renderRoute("/login")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Вход")
    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Забыли пароль?" })).toHaveAttribute(
      "href",
      "/password-reset",
    )
    expect(screen.getByRole("link", { name: "Регистрация" })).toHaveAttribute(
      "href",
      "/registration",
    )
  })

  it("renders the password reset form at /password-reset", () => {
    renderRoute("/password-reset")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Восстановление пароля",
    )
    expect(screen.getByRole("button", { name: "Восстановить пароль" })).toBeDisabled()
  })

  it("renders the employees page at /employees", async () => {
    renderRoute("/employees")
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Сотрудники, участвующие в ГИА/,
      }),
    ).toBeInTheDocument()
    await act(async () => {})
  })

  it("redirects guests from /subscriptions to /login", () => {
    renderRoute("/subscriptions")
    expect(screen.getByTestId("location")).toHaveTextContent("/login")
  })

  it("redirects guests from /settings to /login", () => {
    renderRoute("/settings")
    expect(screen.getByTestId("location")).toHaveTextContent("/login")
  })
})
