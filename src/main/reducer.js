import merge from 'lodash/merge'
import { RESET_ERROR_MESSAGE } from './actions'
import { EMPLOYEES_FILTER_CLEAR_PAGES } from '../employees/actions'
import { EXAMS_FILTER_CLEAR_PAGES } from '../exams/actions'
import { ORGANISATIONS_FILTER_CLEAR_PAGES } from '../organisations/actions'
import { PLACES_FILTER_CLEAR_PAGES } from '../places/actions'

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
  switch (action.type) {
    case EMPLOYEES_FILTER_CLEAR_PAGES:
      return { ...state, empPage: {} }
    case EXAMS_FILTER_CLEAR_PAGES:
      return { ...state, examPage: {} }
    case ORGANISATIONS_FILTER_CLEAR_PAGES:
      return { ...state, orgPage: {} }
    case PLACES_FILTER_CLEAR_PAGES:
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
