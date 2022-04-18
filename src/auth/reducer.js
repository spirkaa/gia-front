import * as c from "./constants"

export const AUTH_INITIAL_STATE = {
  token: null,
  user: {},
  authLoginMsg: {},
  authPasswordResetMsg: {},
  authPasswordResetConfirmMsg: {},
  authRegMsg: {},
  authInfoUpdateMsg: {},
  authPasswordChangeMsg: {},
  authRegVerifyMailMsg: {},
  rememberMe: false,
  isAuthenticating: false,
  isAuthenticated: false,
  isRegistering: false,
  isMailVerifying: false,
  isPasswordChangeRequesting: false,
  isPasswordMailSending: false,
  isPasswordResetConfirming: false,
  isInfoRequesting: false,
  isInfoUpdateRequesting: false,
  showModal: false,
}

export function auth(state = AUTH_INITIAL_STATE, action) {
  let token = null
  let user = {}
  if (action.payload) {
    if (action.payload.access_token) {
      token = action.payload.access_token
    }
    if (action.payload.user) {
      user = action.payload.user
    }
  }

  switch (action.type) {
    case c.AUTH_LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        authLoginMsg: {},
      }
    case c.AUTH_LOGIN_SUCCESS:
      sessionStorage.setItem("token", token)
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: token,
        user: user,
        authLoginMsg: { detail: "Вход выполнен" },
      }
    case c.AUTH_LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: {},
        authLoginMsg: action.payload,
      }
    case c.AUTH_LOGIN_MSG_CLEAR:
      return {
        ...state,
        authLoginMsg: {},
      }
    case c.AUTH_REMEMBER:
      return {
        ...state,
        rememberMe: action.payload,
      }
    case c.AUTH_TOKEN_SAVE:
      localStorage.setItem("token", action.payload)
      return {
        ...state,
      }
    case c.AUTH_TOKEN_CHECK_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: token,
        user: { ...state.user, ...user },
      }
    case c.AUTH_TOKEN_CHECK_FAILURE:
    case c.AUTH_LOGOUT:
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: {},
      }
    case c.AUTH_REG_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        isRegistering: true,
        authRegMsg: {},
      }
    case c.AUTH_REG_SUCCESS:
      sessionStorage.setItem("token", token)
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        isRegistering: false,
        token: token,
        user: user,
        authRegMsg: { detail: "Регистрация успешно завершена" },
      }
    case c.AUTH_REG_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isRegistering: false,
        token: null,
        user: {},
        authRegMsg: action.payload,
      }
    case c.AUTH_REG_MSG_CLEAR:
      return {
        ...state,
        authRegMsg: {},
      }
    case c.AUTH_REG_VERIFY_MAIL_REQUEST:
      return {
        ...state,
        isMailVerifying: true,
        authRegVerifyMailMsg: {},
      }
    case c.AUTH_REG_VERIFY_MAIL_SUCCESS:
      return {
        ...state,
        isMailVerifying: false,
        authRegVerifyMailMsg: action.payload,
      }
    case c.AUTH_REG_VERIFY_MAIL_FAILURE:
      return {
        ...state,
        isMailVerifying: false,
        authRegVerifyMailMsg: action.payload,
      }
    case c.AUTH_REG_VERIFY_MAIL_MSG_CLEAR:
      return {
        ...state,
        authRegVerifyMailMsg: {},
      }
    case c.AUTH_PASSWORD_CHANGE_REQUEST:
      return {
        ...state,
        showModal: true,
        isPasswordChangeRequesting: true,
        authPasswordChangeMsg: {},
      }
    case c.AUTH_PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        showModal: false,
        isPasswordChangeRequesting: false,
        authPasswordChangeMsg: action.payload,
      }
    case c.AUTH_PASSWORD_CHANGE_FAILURE:
      return {
        ...state,
        showModal: true,
        isPasswordChangeRequesting: false,
        authPasswordChangeMsg: action.payload,
      }
    case c.AUTH_PASSWORD_CHANGE_MSG_CLEAR:
      return {
        ...state,
        authPasswordChangeMsg: {},
      }
    case c.AUTH_PASSWORD_RESET_REQUEST:
      return {
        ...state,
        isPasswordMailSending: true,
        authPasswordResetMsg: {},
      }
    case c.AUTH_PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        isPasswordMailSending: false,
        authPasswordResetMsg: action.payload,
      }
    case c.AUTH_PASSWORD_RESET_FAILURE:
      return {
        ...state,
        isPasswordMailSending: false,
        authPasswordResetMsg: action.payload,
      }
    case c.AUTH_PASSWORD_RESET_MSG_CLEAR:
      return {
        ...state,
        authPasswordResetMsg: {},
      }
    case c.AUTH_PASSWORD_RESET_CONFIRM_REQUEST:
      return {
        ...state,
        isPasswordResetConfirming: true,
        authPasswordResetConfirmMsg: {},
      }
    case c.AUTH_PASSWORD_RESET_CONFIRM_SUCCESS:
      return {
        ...state,
        isPasswordResetConfirming: false,
        authPasswordResetConfirmMsg: action.payload,
      }
    case c.AUTH_PASSWORD_RESET_CONFIRM_FAILURE:
      return {
        ...state,
        isPasswordResetConfirming: false,
        authPasswordResetConfirmMsg: action.payload,
      }
    case c.AUTH_PASSWORD_RESET_CONFIRM_MSG_CLEAR:
      return {
        ...state,
        authPasswordResetConfirmMsg: {},
      }
    case c.AUTH_INFO_REQUEST:
      return {
        ...state,
        isInfoRequesting: true,
      }
    case c.AUTH_INFO_SUCCESS:
      return {
        ...state,
        isInfoRequesting: false,
        user: action.payload,
      }
    case c.AUTH_INFO_FAILURE:
      return {
        ...state,
        isInfoRequesting: false,
      }
    case c.AUTH_INFO_UPDATE_REQUEST:
      return {
        ...state,
        isInfoUpdateRequesting: true,
        authInfoUpdateMsg: {},
      }
    case c.AUTH_INFO_UPDATE_SUCCESS:
      return {
        ...state,
        isInfoUpdateRequesting: false,
        user: action.payload,
        authInfoUpdateMsg: { detail: "Настройки успешно обновлены" },
      }
    case c.AUTH_INFO_UPDATE_FAILURE:
      return {
        ...state,
        isInfoUpdateRequesting: false,
        authInfoUpdateMsg: action.payload,
      }
    case c.AUTH_INFO_UPDATE_MSG_CLEAR:
      return {
        ...state,
        authInfoUpdateMsg: {},
      }
    case c.AUTH_MODAL_SHOW:
      return {
        ...state,
        showModal: true,
      }
    case c.AUTH_MODAL_HIDE:
      return {
        ...state,
        showModal: false,
      }
    default:
      return state
  }
}
