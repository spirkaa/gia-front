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
  USER_REG_VERIFY_MAIL_SUCCESS
} from './constants'

export const AUTH_INITIAL_STATE = {
  token: null,
  user: {},
  rememberMe: false,
  isAuthenticating: false,
  isAuthenticated: false,
  isRegistering: false,
  isRegistered: false,
  isMailVerifying: false,
  isMailVerified: false,
  isPasswordChangeRequesting: false,
  isPasswordChangeRequested: false,
  isPasswordMailSending: false,
  isPasswordMailSent: false,
  isPasswordResetConfirming: false,
  isPasswordResetConfirmed: false,
  isInfoRequesting: false,
  isInfoRequested: false,
  isInfoUpdateRequesting: false,
  isInfoUpdateRequested: false,
  showModal: false,
  userLoginErrors: {},
  userPasswordResetErrors: {},
  userPasswordResetConfirmErrors: {},
  userRegErrors: {},
  userInfoUpdateErrors: {},
  userPasswordChangeErrors: {},
  userRegVerifyMailErrors: {},
}

export function auth (state = AUTH_INITIAL_STATE, action) {
  let token = null
  let user = {}
  if (action.response) {
    if (action.response.token) {
      token = action.response.token
    }
    if (action.response.user) {
      user = action.response.user
    }
  }

  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        userLoginErrors: {},
      }
    case USER_LOGIN_SUCCESS:
      sessionStorage.setItem('token', token)
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: token,
        user: user,
        userLoginErrors: { detail: 'Вход выполнен' },
      }
    case USER_LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: {},
        userLoginErrors: action.response,
      }
    case USER_LOGIN_ERRORS_REMOVE:
      return {
        ...state,
        userLoginErrors: {},
      }
    case USER_LOGIN_CHECKBOX:
      return {
        ...state,
        rememberMe: action.response,
      }
    case TOKEN_SAVE:
      localStorage.setItem('token', token)
      return {
        ...state
      }
    case TOKEN_CHECK_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: token,
        user: { ...state.user, ...user },
      }
    case TOKEN_CHECK_FAILURE:
    case USER_LOGOUT:
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: {},
      }
    case USER_REG_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        isRegistering: true,
        userRegErrors: {},
      }
    case USER_REG_SUCCESS:
      sessionStorage.setItem('token', token)
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        isRegistering: false,
        isRegistered: true,
        token: token,
        user: user,
        userRegErrors: { detail: 'Регистрация успешно завершена' },
      }
    case USER_REG_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isRegistering: false,
        isRegistered: false,
        token: null,
        user: {},
        userRegErrors: action.response,
      }
    case USER_REG_ERRORS_REMOVE:
      return {
        ...state,
        userRegErrors: {},
      }
    case USER_REG_VERIFY_MAIL_REQUEST:
      return {
        ...state,
        isMailVerifying: true,
        isMailVerified: false,
        userRegVerifyMailErrors: {},
      }
    case USER_REG_VERIFY_MAIL_SUCCESS:
      return {
        ...state,
        isMailVerifying: false,
        isMailVerified: true,
        userRegVerifyMailErrors: action.response,
      }
    case USER_REG_VERIFY_MAIL_FAILURE:
      return {
        ...state,
        isMailVerifying: false,
        isMailVerified: true,
        userRegVerifyMailErrors: action.response,
      }
    case USER_REG_VERIFY_MAIL_ERRORS_REMOVE:
      return {
        ...state,
        userRegVerifyMailErrors: {},
      }
    case USER_PASSWORD_CHANGE_REQUEST:
      return {
        ...state,
        showModal: true,
        isPasswordChangeRequesting: true,
        userPasswordChangeErrors: {},
      }
    case USER_PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        showModal: false,
        isPasswordChangeRequesting: false,
        isPasswordChangeRequested: true,
        userPasswordChangeErrors: action.response,
      }
    case USER_PASSWORD_CHANGE_FAILURE:
      return {
        ...state,
        showModal: true,
        isPasswordChangeRequesting: false,
        isPasswordChangeRequested: false,
        userPasswordChangeErrors: action.response,
      }
    case USER_PASSWORD_CHANGE_ERRORS_REMOVE:
      return {
        ...state,
        userPasswordChangeErrors: {},
      }
    case USER_PASSWORD_RESET_REQUEST:
      return {
        ...state,
        isPasswordMailSending: true,
        userPasswordResetErrors: {},
      }
    case USER_PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        isPasswordMailSending: false,
        isPasswordMailSent: true,
        userPasswordResetErrors: action.response,
      }
    case USER_PASSWORD_RESET_FAILURE:
      return {
        ...state,
        isPasswordMailSending: false,
        isPasswordMailSent: false,
        userPasswordResetErrors: action.response,
      }
    case USER_PASSWORD_RESET_ERRORS_REMOVE:
      return {
        ...state,
        userPasswordResetErrors: {},
      }
    case USER_PASSWORD_RESET_CONFIRM_REQUEST:
      return {
        ...state,
        isPasswordResetConfirming: true,
        userPasswordResetConfirmErrors: {},
      }
    case USER_PASSWORD_RESET_CONFIRM_SUCCESS:
      return {
        ...state,
        isPasswordResetConfirming: false,
        isPasswordResetConfirmed: true,
        userPasswordResetConfirmErrors: action.response,
      }
    case USER_PASSWORD_RESET_CONFIRM_FAILURE:
      return {
        ...state,
        isPasswordResetConfirming: false,
        isPasswordResetConfirmed: true,
        userPasswordResetConfirmErrors: action.response,
      }
    case USER_PASSWORD_RESET_CONFIRM_ERRORS_REMOVE:
      return {
        ...state,
        userPasswordResetConfirmErrors: {},
      }
    case USER_INFO_REQUEST:
      return {
        ...state,
        isInfoRequesting: true,
      }
    case USER_INFO_SUCCESS:
      return {
        ...state,
        isInfoRequesting: false,
        isInfoRequested: true,
        user: action.response,
      }
    case USER_INFO_FAILURE:
      return {
        ...state,
        isInfoRequesting: false,
        isInfoRequested: false,
      }
    case USER_INFO_UPDATE_REQUEST:
      return {
        ...state,
        isInfoUpdateRequesting: true,
        userInfoUpdateErrors: {},
      }
    case USER_INFO_UPDATE_SUCCESS:
      return {
        ...state,
        isInfoUpdateRequesting: false,
        isInfoUpdateRequested: true,
        user: action.response,
        userInfoUpdateErrors: { detail: 'Настройки успешно обновлены' },
      }
    case USER_INFO_UPDATE_FAILURE:
      return {
        ...state,
        isInfoUpdateRequesting: false,
        isInfoUpdateRequested: false,
        userInfoUpdateErrors: action.response,
      }
    case USER_INFO_UPDATE_ERRORS_REMOVE:
      return {
        ...state,
        userInfoUpdateErrors: {},
      }
    case MODAL_SHOW:
      return {
        ...state,
        showModal: true,
      }
    case MODAL_HIDE:
      return {
        ...state,
        showModal: false,
      }
    default:
      return state
  }
}