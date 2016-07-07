import merge from 'lodash/merge'
import { PLACES_FILTER_SET, PLACES_PAGE_SET } from './actions'

export function placesActivePage (state = 1, action) {
  if (action.type === PLACES_PAGE_SET) {
    return action.payload
  }
  return state
}

export const PLACES_FILTER_INITIAL_STATE = {
  code: '',
  name: '',
  addr: '',
  ateCode: '',
  ateName: ''
}

export function placesFilter (state = PLACES_FILTER_INITIAL_STATE, action) {
  switch (action.type) {
    case PLACES_FILTER_SET:
      return merge({}, state, { ...action.payload })
    default:
      return state
  }
}
