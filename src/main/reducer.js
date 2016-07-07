import merge from 'lodash/merge'
import {
  EMPLOYEES_FILTER_CLEAR_PAGES,
  EXAMS_FILTER_CLEAR_PAGES,
  ORGANISATIONS_FILTER_CLEAR_PAGES,
  PLACES_FILTER_CLEAR_PAGES,
  RESET_ERROR_MESSAGE
} from './actions'

const INITIAL_STATE = {
  datePage: {},
  levelPage: {},
  empPage: {},
  examPage: {},
  orgPage: {},
  placesPage: {},
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
  if (action.type === EMPLOYEES_FILTER_CLEAR_PAGES) {
    return { ...state, empPage: {} }
  }
  if (action.type === EXAMS_FILTER_CLEAR_PAGES) {
    return { ...state, examPage: {} }
  }
  if (action.type === ORGANISATIONS_FILTER_CLEAR_PAGES) {
    return { ...state, orgPage: {} }
  }
  if (action.type === PLACES_FILTER_CLEAR_PAGES) {
    return { ...state, placesPage: {} }
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
