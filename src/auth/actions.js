import jwtDecode from 'jwt-decode'

import { actionTrigger, actionWithPayload, authApi } from '../main/actions'
import * as c from './constants'

export const modalShow = () =>
  actionTrigger(c.AUTH_MODAL_SHOW)

export const modalHide = () =>
  actionTrigger(c.AUTH_MODAL_HIDE)

export const authLoginMsgRemove = () =>
  actionTrigger(c.AUTH_LOGIN_MSG_CLEAR)

export const authPasswordResetMsgRemove = () =>
  actionTrigger(c.AUTH_PASSWORD_RESET_MSG_CLEAR)

export const authPasswordResetConfirmMsgRemove = () =>
  actionTrigger(c.AUTH_PASSWORD_RESET_CONFIRM_MSG_CLEAR)

export const authRegistrationMsgRemove = () =>
  actionTrigger(c.AUTH_REG_MSG_CLEAR)

export const authInfoUpdateMsgRemove = () =>
  actionTrigger(c.AUTH_INFO_UPDATE_MSG_CLEAR)

export const authPasswordChangeMsgRemove = () =>
  actionTrigger(c.AUTH_PASSWORD_CHANGE_MSG_CLEAR)

export const authRegMailVerifyMsgRemove = () =>
  actionTrigger(c.AUTH_REG_VERIFY_MAIL_MSG_CLEAR)

export const authLogout = () =>
  actionTrigger(c.AUTH_LOGOUT)

export const authRememberMe = (checked) =>
  actionWithPayload(c.AUTH_REMEMBER, checked)

export const tokenSave = (token) =>
  actionWithPayload(c.AUTH_TOKEN_SAVE, token)

export function tokenCheck (token) {
  const decoded = jwtDecode(token)
  const user = { email: decoded.email }
  const stillValid = decoded.exp > Date.now() / 1000
  return stillValid
    ? { type: c.AUTH_TOKEN_CHECK_SUCCESS, payload: { token, user } }
    : { type: c.AUTH_TOKEN_CHECK_FAILURE }
}

export function authLogin (email, password) {
  return authApi({
    types: [
      c.AUTH_LOGIN_REQUEST,
      c.AUTH_LOGIN_SUCCESS,
      c.AUTH_LOGIN_FAILURE,
    ],
    endpoint: 'auth/login/',
    data: { email, password },
    method: 'POST',
  })
}

export function authInfo (jwt) {
  return authApi({
    types: [
      c.AUTH_INFO_REQUEST,
      c.AUTH_INFO_SUCCESS,
      c.AUTH_INFO_FAILURE,
    ],
    endpoint: 'auth/user/',
    data: { jwt },
    method: 'GET',
  })
}

export function authInfoUpdate (jwt, username, first_name, last_name) {
  return authApi({
    types: [
      c.AUTH_INFO_UPDATE_REQUEST,
      c.AUTH_INFO_UPDATE_SUCCESS,
      c.AUTH_INFO_UPDATE_FAILURE,
    ],
    endpoint: 'auth/user/',
    data: { jwt, username, first_name, last_name },
    method: 'PUT',
  })
}

export function authRegistration (email, password1, password2) {
  return authApi({
    types: [
      c.AUTH_REG_REQUEST,
      c.AUTH_REG_SUCCESS,
      c.AUTH_REG_FAILURE,
    ],
    endpoint: 'auth/registration/',
    data: { email, password1, password2 },
    method: 'POST',
  })
}

export function authRegVerifyMail (key) {
  return authApi({
    types: [
      c.AUTH_REG_VERIFY_MAIL_REQUEST,
      c.AUTH_REG_VERIFY_MAIL_SUCCESS,
      c.AUTH_REG_VERIFY_MAIL_FAILURE,
    ],
    endpoint: 'auth/registration/verify-email/',
    data: { key },
    method: 'POST',
  })
}

export function authPasswordChange (jwt, old_password, new_password1, new_password2) {
  return authApi({
    types: [
      c.AUTH_PASSWORD_CHANGE_REQUEST,
      c.AUTH_PASSWORD_CHANGE_SUCCESS,
      c.AUTH_PASSWORD_CHANGE_FAILURE,
    ],
    endpoint: 'auth/password/change/',
    data: { jwt, old_password, new_password1, new_password2 },
    method: 'POST',
  })
}

export function authPasswordReset (email) {
  return authApi({
    types: [
      c.AUTH_PASSWORD_RESET_REQUEST,
      c.AUTH_PASSWORD_RESET_SUCCESS,
      c.AUTH_PASSWORD_RESET_FAILURE,
    ],
    endpoint: 'auth/password/reset/',
    data: { email },
    method: 'POST',
  })
}

export function authPasswordResetConfirm (uid, token, new_password1, new_password2) {
  return authApi({
    types: [
      c.AUTH_PASSWORD_RESET_CONFIRM_REQUEST,
      c.AUTH_PASSWORD_RESET_CONFIRM_SUCCESS,
      c.AUTH_PASSWORD_RESET_CONFIRM_FAILURE,
    ],
    endpoint: 'auth/password/reset/confirm/',
    data: { uid, token, new_password1, new_password2 },
    method: 'POST',
  })
}