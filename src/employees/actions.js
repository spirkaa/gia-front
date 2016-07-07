import Schemas from '../middleware/schemas'
import { loadThis } from '../main/actions'
import { EMP_FILTER_INITIAL_STATE } from './reducer'

const EMPLOYEE_ENDPOINT = 'employee'

export const EMPLOYEES_REQUEST = 'EMPLOYEES_REQUEST'
export const EMPLOYEES_SUCCESS = 'EMPLOYEES_SUCCESS'
export const EMPLOYEES_FAILURE = 'EMPLOYEES_FAILURE'

export function loadEmployees (id = 1, filter = EMP_FILTER_INITIAL_STATE) {
  const { name, orgName } = filter
  return loadThis({
    id: id,
    source: 'empPage',
    types: [ EMPLOYEES_REQUEST, EMPLOYEES_SUCCESS, EMPLOYEES_FAILURE ],
    schema: Schemas.EMP_PAGE,
    endpoint: `${EMPLOYEE_ENDPOINT}/?name=${name}&org_name=${orgName}&page=${id}`
  })
}

export const EMPLOYEE_REQUEST = 'EMPLOYEE_REQUEST'
export const EMPLOYEE_SUCCESS = 'EMPLOYEE_SUCCESS'
export const EMPLOYEE_FAILURE = 'EMPLOYEE_FAILURE'

export function loadEmployeeDetail (id) {
  return loadThis({
    id: id,
    source: EMPLOYEE_ENDPOINT,
    types: [ EMPLOYEE_REQUEST, EMPLOYEE_SUCCESS, EMPLOYEE_FAILURE ],
    schema: Schemas.EMP_DETAIL,
    endpoint: `${EMPLOYEE_ENDPOINT}/${id}/`,
    requiredFields: [ 'exams' ]
  })
}

export const EMPLOYEES_FILTER_SET = 'EMPLOYEES_FILTER_SET'

export function empFilterSet (empFilter) {
  return {
    type: EMPLOYEES_FILTER_SET,
    payload: empFilter
  }
}

export const EMPLOYEES_PAGE_SET = 'EMPLOYEES_PAGE_SET'

export function empPageSet (empActivePage) {
  return {
    type: EMPLOYEES_PAGE_SET,
    payload: empActivePage
  }
}
