import merge from 'lodash/merge'
import { ORGANISATIONS_FILTER_SET, ORGANISATIONS_PAGE_SET } from './actions'

export function orgActivePage (state = 1, action) {
  if (action.type === ORGANISATIONS_PAGE_SET) {
    return action.orgActivePage
  }
  return state
}

export function orgFilter (state = { nameVal: '' }, action) {
  switch (action.type) {
    case ORGANISATIONS_FILTER_SET:
      return merge({}, state, { nameVal: action.nameVal })
    default:
      return state
  }
}
