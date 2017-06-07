import {toastr} from 'react-redux-toastr'
import { routerActions } from 'react-router-redux'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { Login }  from './auth/containers'

export const Authenticated = UserAuthWrapper({
  authSelector: state => state.auth,
  authenticatingSelector: state => state.auth.isAuthenticating,
  predicate: auth => auth.isAuthenticated && !auth.isAuthenticating,
  failureRedirectPath: '/login',
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'Authenticated'
})

export const NotAuthenticated = UserAuthWrapper({
    authSelector: state => state.auth,
    authenticatingSelector: state => state.auth.isAuthenticating,
    LoadingComponent: Login,
    predicate: auth => !auth.isAuthenticated && !auth.isAuthenticating,
    failureRedirectPath: (state, ownProps) => {
      if (ownProps.location.query && ownProps.location.query.redirect) {
        return ownProps.location.query.redirect
      }
      return '/subscriptions'
    },
    wrapperDisplayName: 'NotAuthenticated',
    redirectAction: (newLoc) => (dispatch) => {
        dispatch(routerActions.replace(newLoc))
        toastr.success('Вход выполнен', 'Добро пожаловать!')
    },
    allowRedirectBack: false
})