import Schemas from '../middleware/schemas'
import { loadThis } from '../main/actions'
import { EXAM_FILTER_INITIAL_STATE } from './reducer'

const EXAM_ENDPOINT = 'exam'
const DATE_ENDPOINT = 'date'
const LEVEL_ENDPOINT = 'level'

export const EXAMS_REQUEST = 'EXAMS_REQUEST'
export const EXAMS_SUCCESS = 'EXAMS_SUCCESS'
export const EXAMS_FAILURE = 'EXAMS_FAILURE'

export function loadExams (id = 1, filter = EXAM_FILTER_INITIAL_STATE) {
  const {
    date, level,
    placeCode, placeName, placeAddr,
    empName, empOrgName
  } = filter
  return loadThis({
    id: id,
    source: 'examPage',
    types: [ EXAMS_REQUEST, EXAMS_SUCCESS, EXAMS_FAILURE ],
    schema: Schemas.EXAM_PAGE,
    endpoint: `${EXAM_ENDPOINT}/?date=${date}&level=${level}
&p_code=${placeCode}&p_name=${placeName}&p_addr=${placeAddr}
&emp_name=${empName}&emp_org_name=${empOrgName}&page=${id}`
  })
}

export const DATES_REQUEST = 'DATES_REQUEST'
export const DATES_SUCCESS = 'DATES_SUCCESS'
export const DATES_FAILURE = 'DATES_FAILURE'

export function loadDates (id = 1) {
  return loadThis({
    id: id,
    source: 'datePage',
    types: [ DATES_REQUEST, DATES_SUCCESS, DATES_FAILURE ],
    schema: Schemas.DATE_PAGE,
    endpoint: `${DATE_ENDPOINT}/`
  })
}

export const LEVELS_REQUEST = 'LEVELS_REQUEST'
export const LEVELS_SUCCESS = 'LEVELS_SUCCESS'
export const LEVELS_FAILURE = 'LEVELS_FAILURE'

export function loadLevels (id = 1) {
  return loadThis({
    id: id,
    source: 'levelPage',
    types: [ LEVELS_REQUEST, LEVELS_SUCCESS, LEVELS_FAILURE ],
    schema: Schemas.LEVEL_PAGE,
    endpoint: `${LEVEL_ENDPOINT}/`
  })
}

export const EXAMS_FILTER_SET = 'EXAMS_FILTER_SET'

export function examFilterSet (examFilter) {
  return {
    type: EXAMS_FILTER_SET,
    payload: examFilter
  }
}

export const EXAMS_PAGE_SET = 'EXAMS_PAGE_SET'

export function examPageSet (examActivePage) {
  return {
    type: EXAMS_PAGE_SET,
    payload: examActivePage
  }
}
