import { describe, expect, it, vi } from "vitest"
import { CALL_API } from "../middleware/api"

import * as actions from "./actions"
import * as c from "./constants"

const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url")
const makeToken = (exp) =>
  `${b64url({ alg: "HS256" })}.${b64url({ email: "i@i.ru", exp })}.sig`

describe("plain action creators", () => {
  it.each([
    ["modalShow", c.AUTH_MODAL_SHOW],
    ["modalHide", c.AUTH_MODAL_HIDE],
    ["authLoginMsgRemove", c.AUTH_LOGIN_MSG_CLEAR],
    ["authPasswordResetMsgRemove", c.AUTH_PASSWORD_RESET_MSG_CLEAR],
    ["authPasswordResetConfirmMsgRemove", c.AUTH_PASSWORD_RESET_CONFIRM_MSG_CLEAR],
    ["authRegistrationMsgRemove", c.AUTH_REG_MSG_CLEAR],
    ["authInfoUpdateMsgRemove", c.AUTH_INFO_UPDATE_MSG_CLEAR],
    ["authPasswordChangeMsgRemove", c.AUTH_PASSWORD_CHANGE_MSG_CLEAR],
    ["authRegMailVerifyMsgRemove", c.AUTH_REG_VERIFY_MAIL_MSG_CLEAR],
    ["authLogout", c.AUTH_LOGOUT],
  ])("%s triggers the right action", (name, type) => {
    expect(actions[name]()).toEqual({ type })
  })

  it("authRememberMe carries the payload", () => {
    expect(actions.authRememberMe(true)).toEqual({
      type: c.AUTH_REMEMBER,
      payload: true,
    })
    expect(actions.authRememberMe(false)).toEqual({
      type: c.AUTH_REMEMBER,
      payload: false,
    })
  })

  it("tokenSave carries the token", () => {
    expect(actions.tokenSave("jwt-token")).toEqual({
      type: c.AUTH_TOKEN_SAVE,
      payload: "jwt-token",
    })
  })
})

describe("tokenCheck", () => {
  it("succeeds with the decoded user for a valid token", () => {
    const token = makeToken(Math.floor(Date.now() / 1000) + 3600)
    expect(actions.tokenCheck(token)).toEqual({
      type: c.AUTH_TOKEN_CHECK_SUCCESS,
      payload: { access: token, user: { email: "i@i.ru" } },
    })
  })

  it("fails for an expired token", () => {
    const token = makeToken(Math.floor(Date.now() / 1000) - 1)
    expect(actions.tokenCheck(token)).toEqual({ type: c.AUTH_TOKEN_CHECK_FAILURE })
  })
})

describe("API-based creators", () => {
  it("authLogin dispatches a POST to auth/login/", () => {
    const dispatch = vi.fn()
    actions.authLogin("i@i.ru", "secret")(dispatch)
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("auth/login/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({ email: "i@i.ru", password: "secret" })
    expect(call.types).toEqual([
      c.AUTH_LOGIN_REQUEST,
      c.AUTH_LOGIN_SUCCESS,
      c.AUTH_LOGIN_FAILURE,
    ])
  })

  it("authInfo sends the jwt on a GET request", () => {
    const dispatch = vi.fn()
    actions.authInfo("tok")(dispatch)
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("auth/user/")
    expect(call.method).toBe("GET")
    expect(call.data).toEqual({ jwt: "tok" })
    expect(call.types).toEqual([
      c.AUTH_INFO_REQUEST,
      c.AUTH_INFO_SUCCESS,
      c.AUTH_INFO_FAILURE,
    ])
  })

  it("authPasswordResetConfirm dispatches a POST to the confirm endpoint", () => {
    const dispatch = vi.fn()
    actions.authPasswordResetConfirm("uid", "tok", "new1", "new2")(dispatch)
    const call = dispatch.mock.calls[0][0][CALL_API]
    expect(call.endpoint).toBe("auth/password/reset/confirm/")
    expect(call.method).toBe("POST")
    expect(call.data).toEqual({
      uid: "uid",
      token: "tok",
      new_password1: "new1",
      new_password2: "new2",
    })
    expect(call.types).toEqual([
      c.AUTH_PASSWORD_RESET_CONFIRM_REQUEST,
      c.AUTH_PASSWORD_RESET_CONFIRM_SUCCESS,
      c.AUTH_PASSWORD_RESET_CONFIRM_FAILURE,
    ])
  })
})
