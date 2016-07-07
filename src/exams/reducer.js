import merge from 'lodash/merge'
import { EXAMS_FILTER_SET, EXAMS_PAGE_SET } from './actions'

export function examActivePage (state = 1, action) {
  if (action.type === EXAMS_PAGE_SET) {
    return action.payload
  }
  return state
}

export const EXAM_FILTER_INITIAL_STATE = {
  date: '',
  level: '',
  placeCode: '',
  placeName: '',
  placeAddr: '',
  empName: '',
  empOrgName: ''
}

export function examFilter (state = EXAM_FILTER_INITIAL_STATE, action) {
  switch (action.type) {
    case EXAMS_FILTER_SET:
      return merge({}, state, { ...action.payload })
    default:
      return state
  }
}
