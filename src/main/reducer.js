import merge from "lodash/merge"
import { EMPLOYEES_FILTER_CLEAR_PAGES } from "../employees/actions"
import { EXAMS_FILTER_CLEAR_PAGES } from "../exams/actions"
import { ORGANISATIONS_FILTER_CLEAR_PAGES } from "../organisations/actions"
import { PLACES_FILTER_CLEAR_PAGES } from "../places/actions"
import { AUTH_LOGOUT } from "../auth/constants"
import { SUBS_CLEAR_PAGES } from "../subscriptions/constants"

const INITIAL_STATE = {
  dataSourcePage: {},
  datePage: {},
  levelPage: {},
  empPage: {},
  orgPage: {},
  placesPage: {},
  examPage: {},
  subsPage: {},
  datasource: {},
  date: {},
  level: {},
  employee: {},
  organisation: {},
  position: {},
  territory: {},
  place: {},
  exam: {},
  subscription: {},
}

export function entities(state = INITIAL_STATE, action) {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities)
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
    case SUBS_CLEAR_PAGES:
    case AUTH_LOGOUT:
      return { ...state, subsPage: {}, subscription: {} }
    default:
      return state
  }
}
