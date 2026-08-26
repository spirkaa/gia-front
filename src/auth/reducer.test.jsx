import { beforeEach, describe, expect, it } from "vitest"
import * as c from "./constants"
import { AUTH_INITIAL_STATE, auth } from "./reducer"

const loginSuccess = {
  type: c.AUTH_LOGIN_SUCCESS,
  payload: { access: "jwt", user: { email: "a@b.ru" } },
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe("auth", () => {
  it("returns the initial state for unknown actions", () => {
    expect(auth(undefined, { type: "unknown" })).toBe(AUTH_INITIAL_STATE)
  })

  describe("login", () => {
    it("sets isAuthenticating and clears the message on request", () => {
      const next = auth(AUTH_INITIAL_STATE, { type: c.AUTH_LOGIN_REQUEST })
      expect(next.isAuthenticating).toBe(true)
      expect(next.authLoginMsg).toEqual({})
    })

    it("stores the token and authenticates on success", () => {
      const next = auth(AUTH_INITIAL_STATE, loginSuccess)
      expect(next.isAuthenticating).toBe(false)
      expect(next.isAuthenticated).toBe(true)
      expect(next.token).toBe("jwt")
      expect(next.user).toEqual({ email: "a@b.ru" })
      expect(next.authLoginMsg).toEqual({ detail: "Вход выполнен" })
      expect(sessionStorage.getItem("token")).toBe("jwt")
    })

    it("clears the credentials and stores the error on failure", () => {
      const prev = {
        ...AUTH_INITIAL_STATE,
        isAuthenticated: true,
        token: "old",
        user: { email: "a@b.ru" },
      }
      const next = auth(prev, {
        type: c.AUTH_LOGIN_FAILURE,
        payload: { detail: "Неверный email" },
      })
      expect(next.isAuthenticating).toBe(false)
      expect(next.isAuthenticated).toBe(false)
      expect(next.token).toBeNull()
      expect(next.user).toEqual({})
      expect(next.authLoginMsg).toEqual({ detail: "Неверный email" })
    })

    it("clears the login message on demand", () => {
      const prev = { ...AUTH_INITIAL_STATE, authLoginMsg: { detail: "x" } }
      expect(auth(prev, { type: c.AUTH_LOGIN_MSG_CLEAR }).authLoginMsg).toEqual({})
    })
  })

  describe("token check", () => {
    it("authenticates and merges the decoded user on success", () => {
      const prev = { ...AUTH_INITIAL_STATE, user: { id: 1 } }
      const next = auth(prev, {
        type: c.AUTH_TOKEN_CHECK_SUCCESS,
        payload: loginSuccess.payload,
      })
      expect(next.isAuthenticating).toBe(false)
      expect(next.isAuthenticated).toBe(true)
      expect(next.token).toBe("jwt")
      expect(next.user).toEqual({ id: 1, email: "a@b.ru" })
    })

    it("logs the user out and removes stored tokens on failure", () => {
      localStorage.setItem("token", "local")
      sessionStorage.setItem("token", "session")
      const prev = { ...AUTH_INITIAL_STATE, isAuthenticated: true, token: "jwt" }
      const next = auth(prev, { type: c.AUTH_TOKEN_CHECK_FAILURE })
      expect(next.isAuthenticated).toBe(false)
      expect(next.token).toBeNull()
      expect(next.user).toEqual({})
      expect(localStorage.getItem("token")).toBeNull()
      expect(sessionStorage.getItem("token")).toBeNull()
    })
  })

  it("removes stored tokens on logout", () => {
    localStorage.setItem("token", "local")
    sessionStorage.setItem("token", "session")
    const prev = { ...AUTH_INITIAL_STATE, isAuthenticated: true, token: "jwt" }
    const next = auth(prev, { type: c.AUTH_LOGOUT })
    expect(next.isAuthenticated).toBe(false)
    expect(next.token).toBeNull()
    expect(localStorage.getItem("token")).toBeNull()
    expect(sessionStorage.getItem("token")).toBeNull()
  })

  it("saves the token to localStorage on AUTH_TOKEN_SAVE", () => {
    auth(AUTH_INITIAL_STATE, { type: c.AUTH_TOKEN_SAVE, payload: "persisted" })
    expect(localStorage.getItem("token")).toBe("persisted")
  })

  it("stores the rememberMe flag", () => {
    expect(
      auth(AUTH_INITIAL_STATE, { type: c.AUTH_REMEMBER, payload: true }).rememberMe,
    ).toBe(true)
  })

  describe("registration", () => {
    it("sets isRegistering on request", () => {
      const next = auth(AUTH_INITIAL_STATE, { type: c.AUTH_REG_REQUEST })
      expect(next.isRegistering).toBe(true)
      expect(next.isAuthenticated).toBe(false)
      expect(next.authRegMsg).toEqual({})
    })

    it("authenticates and stores the token on success", () => {
      const next = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_REG_SUCCESS,
        payload: loginSuccess.payload,
      })
      expect(next.isRegistering).toBe(false)
      expect(next.isAuthenticated).toBe(true)
      expect(next.token).toBe("jwt")
      expect(next.user).toEqual({ email: "a@b.ru" })
      expect(next.authRegMsg).toEqual({ detail: "Регистрация успешно завершена" })
      expect(sessionStorage.getItem("token")).toBe("jwt")
    })

    it("resets the credentials and stores the error on failure", () => {
      const next = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_REG_FAILURE,
        payload: { detail: "error" },
      })
      expect(next.isRegistering).toBe(false)
      expect(next.isAuthenticated).toBe(false)
      expect(next.token).toBeNull()
      expect(next.authRegMsg).toEqual({ detail: "error" })
    })

    it("clears the registration message on demand", () => {
      const prev = { ...AUTH_INITIAL_STATE, authRegMsg: { detail: "x" } }
      expect(auth(prev, { type: c.AUTH_REG_MSG_CLEAR }).authRegMsg).toEqual({})
    })
  })

  describe("mail verification", () => {
    it("sets isMailVerifying on request", () => {
      const next = auth(AUTH_INITIAL_STATE, { type: c.AUTH_REG_VERIFY_MAIL_REQUEST })
      expect(next.isMailVerifying).toBe(true)
      expect(next.authRegVerifyMailMsg).toEqual({})
    })

    it("stores the response message on success and failure", () => {
      const ok = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_REG_VERIFY_MAIL_SUCCESS,
        payload: { detail: "ok" },
      })
      expect(ok.isMailVerifying).toBe(false)
      expect(ok.authRegVerifyMailMsg).toEqual({ detail: "ok" })

      const fail = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_REG_VERIFY_MAIL_FAILURE,
        payload: { detail: "bad" },
      })
      expect(fail.isMailVerifying).toBe(false)
      expect(fail.authRegVerifyMailMsg).toEqual({ detail: "bad" })
    })

    it("clears the message on demand", () => {
      const prev = { ...AUTH_INITIAL_STATE, authRegVerifyMailMsg: { detail: "x" } }
      expect(
        auth(prev, { type: c.AUTH_REG_VERIFY_MAIL_MSG_CLEAR }).authRegVerifyMailMsg,
      ).toEqual({})
    })
  })

  describe("password change", () => {
    it("opens the modal and sets isPasswordChangeRequesting on request", () => {
      const next = auth(AUTH_INITIAL_STATE, { type: c.AUTH_PASSWORD_CHANGE_REQUEST })
      expect(next.showModal).toBe(true)
      expect(next.isPasswordChangeRequesting).toBe(true)
      expect(next.authPasswordChangeMsg).toEqual({})
    })

    it("closes the modal and stores the response on success", () => {
      const next = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_PASSWORD_CHANGE_SUCCESS,
        payload: { detail: "ok" },
      })
      expect(next.showModal).toBe(false)
      expect(next.isPasswordChangeRequesting).toBe(false)
      expect(next.authPasswordChangeMsg).toEqual({ detail: "ok" })
    })

    it("keeps the modal open on failure", () => {
      const next = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_PASSWORD_CHANGE_FAILURE,
        payload: { detail: "bad" },
      })
      expect(next.showModal).toBe(true)
      expect(next.isPasswordChangeRequesting).toBe(false)
      expect(next.authPasswordChangeMsg).toEqual({ detail: "bad" })
    })

    it("clears the message on demand", () => {
      const prev = { ...AUTH_INITIAL_STATE, authPasswordChangeMsg: { detail: "x" } }
      expect(
        auth(prev, { type: c.AUTH_PASSWORD_CHANGE_MSG_CLEAR }).authPasswordChangeMsg,
      ).toEqual({})
    })
  })

  describe("password reset", () => {
    it("sets isPasswordMailSending on request", () => {
      const next = auth(AUTH_INITIAL_STATE, { type: c.AUTH_PASSWORD_RESET_REQUEST })
      expect(next.isPasswordMailSending).toBe(true)
      expect(next.authPasswordResetMsg).toEqual({})
    })

    it("stores the response message on success and failure", () => {
      const ok = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_PASSWORD_RESET_SUCCESS,
        payload: { detail: "ok" },
      })
      expect(ok.isPasswordMailSending).toBe(false)
      expect(ok.authPasswordResetMsg).toEqual({ detail: "ok" })

      const fail = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_PASSWORD_RESET_FAILURE,
        payload: { detail: "bad" },
      })
      expect(fail.isPasswordMailSending).toBe(false)
      expect(fail.authPasswordResetMsg).toEqual({ detail: "bad" })
    })

    it("clears the message on demand", () => {
      const prev = { ...AUTH_INITIAL_STATE, authPasswordResetMsg: { detail: "x" } }
      expect(
        auth(prev, { type: c.AUTH_PASSWORD_RESET_MSG_CLEAR }).authPasswordResetMsg,
      ).toEqual({})
    })
  })

  describe("password reset confirm", () => {
    it("sets isPasswordResetConfirming on request", () => {
      const next = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_PASSWORD_RESET_CONFIRM_REQUEST,
      })
      expect(next.isPasswordResetConfirming).toBe(true)
      expect(next.authPasswordResetConfirmMsg).toEqual({})
    })

    it("stores the response message on success and failure", () => {
      const ok = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_PASSWORD_RESET_CONFIRM_SUCCESS,
        payload: { detail: "ok" },
      })
      expect(ok.isPasswordResetConfirming).toBe(false)
      expect(ok.authPasswordResetConfirmMsg).toEqual({ detail: "ok" })

      const fail = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_PASSWORD_RESET_CONFIRM_FAILURE,
        payload: { detail: "bad" },
      })
      expect(fail.isPasswordResetConfirming).toBe(false)
      expect(fail.authPasswordResetConfirmMsg).toEqual({ detail: "bad" })
    })

    it("clears the message on demand", () => {
      const prev = {
        ...AUTH_INITIAL_STATE,
        authPasswordResetConfirmMsg: { detail: "x" },
      }
      expect(
        auth(prev, { type: c.AUTH_PASSWORD_RESET_CONFIRM_MSG_CLEAR })
          .authPasswordResetConfirmMsg,
      ).toEqual({})
    })
  })

  describe("user info", () => {
    it("sets isInfoRequesting on request and clears it on both outcomes", () => {
      expect(
        auth(AUTH_INITIAL_STATE, { type: c.AUTH_INFO_REQUEST }).isInfoRequesting,
      ).toBe(true)
      expect(
        auth(AUTH_INITIAL_STATE, { type: c.AUTH_INFO_SUCCESS }).isInfoRequesting,
      ).toBe(false)
      expect(
        auth(AUTH_INITIAL_STATE, { type: c.AUTH_INFO_FAILURE }).isInfoRequesting,
      ).toBe(false)
    })

    it("stores the user on success", () => {
      const next = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_INFO_SUCCESS,
        payload: { id: 1, email: "a@b.ru" },
      })
      expect(next.user).toEqual({ id: 1, email: "a@b.ru" })
    })
  })

  describe("user info update", () => {
    it("sets isInfoUpdateRequesting and clears the message on request", () => {
      const next = auth(AUTH_INITIAL_STATE, { type: c.AUTH_INFO_UPDATE_REQUEST })
      expect(next.isInfoUpdateRequesting).toBe(true)
      expect(next.authInfoUpdateMsg).toEqual({})
    })

    it("stores the user and a success message on success", () => {
      const next = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_INFO_UPDATE_SUCCESS,
        payload: { id: 1, email: "a@b.ru" },
      })
      expect(next.isInfoUpdateRequesting).toBe(false)
      expect(next.user).toEqual({ id: 1, email: "a@b.ru" })
      expect(next.authInfoUpdateMsg).toEqual({ detail: "Настройки успешно обновлены" })
    })

    it("stores the error message on failure", () => {
      const next = auth(AUTH_INITIAL_STATE, {
        type: c.AUTH_INFO_UPDATE_FAILURE,
        payload: { detail: "bad" },
      })
      expect(next.isInfoUpdateRequesting).toBe(false)
      expect(next.authInfoUpdateMsg).toEqual({ detail: "bad" })
    })

    it("clears the message on demand", () => {
      const prev = { ...AUTH_INITIAL_STATE, authInfoUpdateMsg: { detail: "x" } }
      expect(
        auth(prev, { type: c.AUTH_INFO_UPDATE_MSG_CLEAR }).authInfoUpdateMsg,
      ).toEqual({})
    })
  })

  it("shows and hides the modal", () => {
    expect(auth(AUTH_INITIAL_STATE, { type: c.AUTH_MODAL_SHOW }).showModal).toBe(true)
    expect(auth(AUTH_INITIAL_STATE, { type: c.AUTH_MODAL_HIDE }).showModal).toBe(false)
  })
})
