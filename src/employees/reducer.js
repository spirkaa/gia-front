import merge from 'lodash/merge'
import { EMPLOYEES_FILTER_SET, EMPLOYEES_PAGE_SET } from './actions'

export function empActivePage (state = 1, action) {
  if (action.type === EMPLOYEES_PAGE_SET) {
    return action.empActivePage
  }
  return state
}

export function empFilter (state = { nameVal: '', orgNameVal: '' }, action) {
  switch (action.type) {
    case EMPLOYEES_FILTER_SET:
      return merge({}, state, { nameVal: action.nameVal, orgNameVal: action.orgNameVal })
    default:
      return state
  }
}
