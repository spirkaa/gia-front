import { toastr } from "react-redux-toastr"
import { routerActions } from "connected-react-router"
import { connectedReduxRedirect } from "redux-auth-wrapper/history4/redirect"

import { Login } from "./auth/containers"

export const Authenticated = connectedReduxRedirect({
  authenticatedSelector: (state) =>
    state.auth.isAuthenticated && !state.auth.isAuthenticating,
  authenticatingSelector: (state) => state.auth.isAuthenticating,
  redirectPath: "/login",
  redirectAction: routerActions.replace,
  wrapperDisplayName: "Authenticated",
})

export const NotAuthenticated = connectedReduxRedirect({
  authenticatedSelector: (state) =>
    !state.auth.isAuthenticated && !state.auth.isAuthenticating,
  authenticatingSelector: (state) => state.auth.isAuthenticating,
  redirectPath: (state, ownProps) => {
    if (ownProps.location.query && ownProps.location.query.redirect) {
      return ownProps.location.query.redirect
    }
    return "/subscriptions"
  },
  redirectAction: (newLoc) => (dispatch) => {
    dispatch(routerActions.replace(newLoc))
    toastr.success("Вход выполнен", "Добро пожаловать!")
  },
  wrapperDisplayName: "NotAuthenticated",
  AuthenticatingComponent: Login,
  allowRedirectBack: false,
})
