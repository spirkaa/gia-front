import merge from "lodash/merge"
import { ORGANISATIONS_FILTER_SET, ORGANISATIONS_PAGE_SET } from "./actions"

export function orgActivePage(state = 1, action) {
  if (action.type === ORGANISATIONS_PAGE_SET) {
    return action.payload
  }
  return state
}

export const ORG_FILTER_INITIAL_STATE = {
  search: "",
}

export function orgFilter(state = ORG_FILTER_INITIAL_STATE, action) {
  switch (action.type) {
    case ORGANISATIONS_FILTER_SET:
      return merge({}, state, { ...action.payload })
    default:
      return state
  }
}
