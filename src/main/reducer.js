import merge from 'lodash/merge'
import { FILTER_CLEAR_PAGES, RESET_ERROR_MESSAGE } from './actions'

const INITIAL_STATE = {
  page: {},
  employee: {},
  exam: {},
  date: {},
  level: {},
  position: {},
  organisation: {},
  place: {},
  territory: {}
}

export function entities (state = INITIAL_STATE, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }
  if (action.type === FILTER_CLEAR_PAGES) {
    return { ...state, page: {} }
  }
  return state
}

export function errorMessage (state = null, action) {
  if (action.type === RESET_ERROR_MESSAGE) {
    return null
  } else if (action.error) {
    return action.error
  }
  return state
}
