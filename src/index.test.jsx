import { act } from "react"
import { screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const tokenCheck = vi.hoisted(() =>
  vi.fn((token) => ({
    type: "@auth/TOKEN_CHECK_SUCCESS",
    payload: { access: token, user: { email: "i@i.ru" } },
  })),
)

vi.mock("./auth/actions", async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, tokenCheck }
})

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}))

const year = new Date().getFullYear()

const bootApp = async () => {
  document.body.innerHTML = '<div id="root"></div>'
  vi.resetModules()
  await act(async () => {
    await import("./index")
  })
}

describe("index bootstrap", () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    tokenCheck.mockClear()
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ count: 0, next: null, previous: null, results: [] }),
        }),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("boots into the guest state and renders the brand when no token is stored", async () => {
    await bootApp()
    expect(tokenCheck).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: `ГИА ${year} в Москве` }),
      ).toHaveAttribute("href", "/")
    })
  })

  it("does not run tokenCheck when the stored token is the string 'null'", async () => {
    localStorage.token = "null"
    await bootApp()
    expect(tokenCheck).not.toHaveBeenCalled()
  })

  it("runs tokenCheck with the session token and signs the user in", async () => {
    sessionStorage.token = "valid-jwt"
    await bootApp()
    expect(tokenCheck).toHaveBeenCalledWith("valid-jwt")
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "i@i.ru" })).toBeInTheDocument()
    })
  })

  it("falls back to the localStorage token when sessionStorage is empty", async () => {
    localStorage.token = "valid-jwt"
    await bootApp()
    expect(tokenCheck).toHaveBeenCalledWith("valid-jwt")
  })
})
