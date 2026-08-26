import { render, screen } from "@testing-library/react"
import { act } from "react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { afterEach, describe, expect, it, vi } from "vitest"

import api from "../../middleware/api"
import rootReducer from "../../reducer"
import { makeState } from "../../test/fixtures"
import Subscriptions from "./Subscriptions"

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const sub = () => ({
  id: "s1",
  email: "a@b.c",
  employee: {
    id: "e1",
    name: "Employee 1",
    org: { id: "o1", name: "Школа 1" },
    exams: [],
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
    makeState({ auth: { token: "jwt" } }),
    applyMiddleware(recording, thunk, api),
  )
  return { store, actions }
}

const renderSubs = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/subscriptions"]}>
        <HelmetProvider>
          <Subscriptions />
        </HelmetProvider>
      </MemoryRouter>
    </Provider>,
  )

const stubFetch = (responses) => {
  let call = 0
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      const response = responses[Math.min(call, responses.length - 1)]
      call += 1
      return Promise.resolve({ ok: true, json: () => Promise.resolve(response) })
    }),
  )
}

describe("Subscriptions page", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fetches the subscriptions page with the token on mount", async () => {
    stubFetch([
      {
        count: 1,
        next: null,
        previous: null,
        results: [sub()],
      },
    ])
    const fetch = vi.mocked(globalThis.fetch)
    renderSubs(makeStore().store)
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe("http://localhost:8000/api/v1/subscription/?page=1")
    expect(options.method).toBe("GET")
    expect(options.headers.Authorization).toBe("JWT jwt")
    await act(async () => {})
  })

  it("renders the subscription row and the disabled delete button on success", async () => {
    stubFetch([
      {
        count: 1,
        next: null,
        previous: null,
        results: [sub()],
      },
    ])
    const { container } = renderSubs(makeStore().store)
    await screen.findByRole("link", { name: "Employee 1" })

    expect(
      screen.getByRole("heading", { name: /Подписки/ }).querySelector("small"),
    ).toHaveTextContent("1")
    expect(
      screen.getByText(
        "При появлении новых экзаменов мы отправим уведомление на почту",
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Employee 1" })).toHaveAttribute(
      "href",
      "/employees/detail/e1",
    )
    expect(screen.getByRole("link", { name: "Школа 1" })).toHaveAttribute(
      "href",
      "/organisations/detail/o1",
    )
    expect(screen.getByRole("button", { name: /Отменить подписку/ })).toBeDisabled()
    expect(container.querySelector("ul.pagination")).toBeNull()
  })

  it("deletes a selected subscription and shows the empty state", async () => {
    stubFetch([
      { count: 1, next: null, previous: null, results: [sub()] },
      {},
      { count: 0, next: null, previous: null, results: [] },
    ])
    const fetch = vi.mocked(globalThis.fetch)
    renderSubs(makeStore().store)
    const user = userEvent.setup()
    await screen.findByRole("link", { name: "Employee 1" })

    await user.click(screen.getAllByRole("checkbox")[1])
    await user.click(screen.getByRole("button", { name: /Отменить подписку/ }))

    const employeesLink = await screen.findByRole("link", { name: "Сотрудники" })
    expect(employeesLink).toHaveAttribute("href", "/employees")
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch.mock.calls[1][0]).toBe("http://localhost:8000/api/v1/subscription/s1/")
    expect(fetch.mock.calls[1][1].method).toBe("DELETE")
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ jwt: "jwt" })
    expect(fetch.mock.calls[2][0]).toBe(
      "http://localhost:8000/api/v1/subscription/?page=1",
    )
    expect(fetch.mock.calls[2][1].method).toBe("GET")
  })

  it("shows the empty state when there are no subscriptions", async () => {
    stubFetch([{ count: 0, next: null, previous: null, results: [] }])
    renderSubs(makeStore().store)

    const employeesLink = await screen.findByRole("link", { name: "Сотрудники" })
    expect(employeesLink).toHaveAttribute("href", "/employees")
    expect(
      screen.getByRole("heading", { name: /Подписки/ }).querySelector("small"),
    ).toHaveTextContent("...")
  })

  it("shows a loading state while the page is being fetched", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    )
    renderSubs(makeStore().store)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })
})
