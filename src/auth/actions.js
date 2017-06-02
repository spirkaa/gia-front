import jwtDecode from 'jwt-decode'

import load from '../main/actions'

import {
  MODAL_HIDE,
  MODAL_SHOW,
  TOKEN_CHECK_FAILURE,
  TOKEN_CHECK_SUCCESS,
  TOKEN_SAVE,
  USER_INFO_FAILURE,
  USER_INFO_REQUEST,
  USER_INFO_SUCCESS,
  USER_INFO_UPDATE_ERRORS_REMOVE,
  USER_INFO_UPDATE_FAILURE,
  USER_INFO_UPDATE_REQUEST,
  USER_INFO_UPDATE_SUCCESS,
  USER_LOGIN_CHECKBOX,
  USER_LOGIN_ERRORS_REMOVE,
  USER_LOGIN_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_PASSWORD_CHANGE_ERRORS_REMOVE,
  USER_PASSWORD_CHANGE_FAILURE,
  USER_PASSWORD_CHANGE_REQUEST,
  USER_PASSWORD_CHANGE_SUCCESS,
  USER_PASSWORD_RESET_CONFIRM_ERRORS_REMOVE,
  USER_PASSWORD_RESET_CONFIRM_FAILURE,
  USER_PASSWORD_RESET_CONFIRM_REQUEST,
  USER_PASSWORD_RESET_CONFIRM_SUCCESS,
  USER_PASSWORD_RESET_ERRORS_REMOVE,
  USER_PASSWORD_RESET_FAILURE,
  USER_PASSWORD_RESET_REQUEST,
  USER_PASSWORD_RESET_SUCCESS,
  USER_REG_ERRORS_REMOVE,
  USER_REG_FAILURE,
  USER_REG_REQUEST,
  USER_REG_SUCCESS,
  USER_REG_VERIFY_MAIL_ERRORS_REMOVE,
  USER_REG_VERIFY_MAIL_FAILURE,
  USER_REG_VERIFY_MAIL_REQUEST,
  USER_REG_VERIFY_MAIL_SUCCESS,
} from './constants'

export function authApi (params) {
  const { endpoint, types, data, method } = params
  const schema = null
  return dispatch => {
    dispatch(load(endpoint, types, schema, data, method))
  }
}

export function modalShow () {
  return {
    type: MODAL_SHOW,
  }
}

export function modalHide () {
  return {
    type: MODAL_HIDE,
  }
}

export function userLoginErrorsRemove () {
  return {
    type: USER_LOGIN_ERRORS_REMOVE,
  }
}

export function userPasswordResetErrorsRemove () {
  return {
    type: USER_PASSWORD_RESET_ERRORS_REMOVE,
  }
}

export function userPasswordResetConfirmErrorsRemove () {
  return {
    type: USER_PASSWORD_RESET_CONFIRM_ERRORS_REMOVE,
  }
}

export function userRegistrationErrorsRemove () {
  return {
    type: USER_REG_ERRORS_REMOVE,
  }
}

export function userInfoUpdateErrorsRemove () {
  return {
    type: USER_INFO_UPDATE_ERRORS_REMOVE,
  }
}

export function userPasswordChangeErrorsRemove () {
  return {
    type: USER_PASSWORD_CHANGE_ERRORS_REMOVE,
  }
}

export function userRegMailVerifyErrorsRemove () {
  return {
    type: USER_REG_VERIFY_MAIL_ERRORS_REMOVE,
  }
}

export function userRememberMe (checked) {
  return {
    type: USER_LOGIN_CHECKBOX,
    response: checked,
  }
}

export function userLogout () {
  return {
    type: USER_LOGOUT,
  }
}

export function tokenSave (token) {
  return {
    type: TOKEN_SAVE,
    response: { token }
  }
}

export function tokenCheck (token) {
  const decoded = jwtDecode(token)
  const user = { email: decoded.email }
  const stillValid = decoded.exp > Date.now() / 1000
  return stillValid
    ? { type: TOKEN_CHECK_SUCCESS, response: { token, user } }
    : { type: TOKEN_CHECK_FAILURE }
}

export function userLogin (email, password) {
  return authApi({
    types: [
      USER_LOGIN_REQUEST,
      USER_LOGIN_SUCCESS,
      USER_LOGIN_FAILURE,
    ],
    endpoint: 'auth/login/',
    data: { email, password },
    method: 'POST',
  })
}

export function userInfo (jwt) {
  return authApi({
    types: [
      USER_INFO_REQUEST,
      USER_INFO_SUCCESS,
      USER_INFO_FAILURE,
    ],
    endpoint: 'auth/user/',
    data: { jwt },
    method: 'GET',
  })
}

export function userInfoUpdate (jwt, username, first_name, last_name) {
  return authApi({
    types: [
      USER_INFO_UPDATE_REQUEST,
      USER_INFO_UPDATE_SUCCESS,
      USER_INFO_UPDATE_FAILURE,
    ],
    endpoint: 'auth/user/',
    data: { jwt, username, first_name, last_name },
    method: 'PUT',
  })
}

export function userRegistration (email, password1, password2) {
  return authApi({
    types: [
      USER_REG_REQUEST,
      USER_REG_SUCCESS,
      USER_REG_FAILURE,
    ],
    endpoint: 'auth/registration/',
    data: { email, password1, password2 },
    method: 'POST',
  })
}

export function userRegVerifyMail (key) {
  return authApi({
    types: [
      USER_REG_VERIFY_MAIL_REQUEST,
      USER_REG_VERIFY_MAIL_SUCCESS,
      USER_REG_VERIFY_MAIL_FAILURE,
    ],
    endpoint: 'auth/registration/verify-email/',
    data: { key },
    method: 'POST',
  })
}

export function userPasswordChange (jwt, old_password, new_password1, new_password2) {
  return authApi({
    types: [
      USER_PASSWORD_CHANGE_REQUEST,
      USER_PASSWORD_CHANGE_SUCCESS,
      USER_PASSWORD_CHANGE_FAILURE,
    ],
    endpoint: 'auth/password/change/',
    data: { jwt, old_password, new_password1, new_password2 },
    method: 'POST',
  })
}

export function userPasswordReset (email) {
  return authApi({
    types: [
      USER_PASSWORD_RESET_REQUEST,
      USER_PASSWORD_RESET_SUCCESS,
      USER_PASSWORD_RESET_FAILURE,
    ],
    endpoint: 'auth/password/reset/',
    data: { email },
    method: 'POST',
  })
}

export function userPasswordResetConfirm (uid, token, new_password1, new_password2) {
  return authApi({
    types: [
      USER_PASSWORD_RESET_CONFIRM_REQUEST,
      USER_PASSWORD_RESET_CONFIRM_SUCCESS,
      USER_PASSWORD_RESET_CONFIRM_FAILURE,
    ],
    endpoint: 'auth/password/reset/confirm/',
    data: { uid, token, new_password1, new_password2 },
    method: 'POST',
  })
}