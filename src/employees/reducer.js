import merge from 'lodash/merge'
import { EMPLOYEES_FILTER_SET, EMPLOYEES_PAGE_SET } from './actions'

export function empActivePage (state = 1, action) {
  if (action.type === EMPLOYEES_PAGE_SET) {
    return action.empActivePage
  }
  return state
}

export const EMP_FILTER_INITIAL_STATE = {
  name: '',
  orgName: ''
}

export function empFilter (state = EMP_FILTER_INITIAL_STATE, action) {
  switch (action.type) {
    case EMPLOYEES_FILTER_SET:
      return merge({}, state, { ...action.empFilter })
    default:
      return state
  }
}
