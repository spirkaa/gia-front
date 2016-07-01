import merge from 'lodash/merge'
import { FILTER_UPDATE_VALUE, ACTIVE_PAGE_SET } from './actions'

export function activePage (state = 1, action) {
  if (action.type === ACTIVE_PAGE_SET) {
    return action.activePage
  }
  return state
}

export function filter (state = { nameVal: '', orgNameVal: '' }, action) {
  switch (action.type) {
    case FILTER_UPDATE_VALUE:
      return merge({}, state, { nameVal: action.nameVal, orgNameVal: action.orgNameVal })
    default:
      return state
  }
}
