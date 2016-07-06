import Schemas from '../middleware/schemas'
import load from '../main/actions'
import { EXAM_FILTER_INITIAL_STATE } from './reducer'

export const EXAMS_REQUEST = 'EXAMS_REQUEST'
export const EXAMS_SUCCESS = 'EXAMS_SUCCESS'
export const EXAMS_FAILURE = 'EXAMS_FAILURE'

export function loadExams (pageNum = 1, filter = EXAM_FILTER_INITIAL_STATE) {
  const types = [ EXAMS_REQUEST, EXAMS_SUCCESS, EXAMS_FAILURE ]
  const {
    date, level,
    placeCode, placeName, placeAddr,
    empName, empOrgName
  } = filter
  return (dispatch, getState) => {
    const page = getState().entities.examPage[ pageNum ]
    if (page) {
      return null
    }
    const url = `exam/
?date=${date}&level=${level}
&p_code=${placeCode}&p_name=${placeName}&p_addr=${placeAddr}
&emp_name=${empName}&emp_org_name=${empOrgName}&page=${pageNum}`
    return dispatch(load(url, types, Schemas.EXAM_PAGE))
  }
}

export const DATES_REQUEST = 'DATES_REQUEST'
export const DATES_SUCCESS = 'DATES_SUCCESS'
export const DATES_FAILURE = 'DATES_FAILURE'

export function loadDates (pageNum = 1) {
  const types = [ DATES_REQUEST, DATES_SUCCESS, DATES_FAILURE ]
  return (dispatch, getState) => {
    const page = getState().entities.datePage[ pageNum ]
    if (page) {
      return null
    }
    return dispatch(load('date/', types, Schemas.DATE_PAGE))
  }
}

export const LEVELS_REQUEST = 'LEVELS_REQUEST'
export const LEVELS_SUCCESS = 'LEVELS_SUCCESS'
export const LEVELS_FAILURE = 'LEVELS_FAILURE'

export function loadLevels (pageNum = 1) {
  const types = [ LEVELS_REQUEST, LEVELS_SUCCESS, LEVELS_FAILURE ]
  return (dispatch, getState) => {
    const page = getState().entities.levelPage[ pageNum ]
    if (page) {
      return null
    }
    return dispatch(load('level/', types, Schemas.LEVEL_PAGE))
  }
}

export const EXAMS_FILTER_SET = 'EXAMS_FILTER_SET'

export function examFilterSet (examFilter) {
  return dispatch => dispatch({
    type: EXAMS_FILTER_SET,
    examFilter
  })
}

export const EXAMS_PAGE_SET = 'EXAMS_PAGE_SET'

export function examPageSet (examActivePage) {
  return dispatch => dispatch({
    type: EXAMS_PAGE_SET,
    examActivePage
  })
}
