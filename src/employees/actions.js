import Schemas from '../middleware/schemas'
import load from '../main/actions'
import { EMP_FILTER_INITIAL_STATE } from './reducer'

export const EMPLOYEES_REQUEST = 'EMPLOYEES_REQUEST'
export const EMPLOYEES_SUCCESS = 'EMPLOYEES_SUCCESS'
export const EMPLOYEES_FAILURE = 'EMPLOYEES_FAILURE'

// Relies on Redux Thunk middleware.
export function loadEmployees (pageNum = 1, filter = EMP_FILTER_INITIAL_STATE) {
  const types = [ EMPLOYEES_REQUEST, EMPLOYEES_SUCCESS, EMPLOYEES_FAILURE ]
  const { name, orgName } = filter
  return (dispatch, getState) => {
    const page = getState().entities.empPage[ pageNum ]
    if (page) {
      return null
    }
    const url = `employee/?name=${name}&org_name=${orgName}&page=${pageNum}`
    return dispatch(load(url, types, Schemas.EMP_PAGE))
  }
}

export const EMPLOYEE_REQUEST = 'EMPLOYEE_REQUEST'
export const EMPLOYEE_SUCCESS = 'EMPLOYEE_SUCCESS'
export const EMPLOYEE_FAILURE = 'EMPLOYEE_FAILURE'

export function loadEmployeeDetail (id, requiredFields = []) {
  const types = [ EMPLOYEE_REQUEST, EMPLOYEE_SUCCESS, EMPLOYEE_FAILURE ]
  return (dispatch, getState) => {
    const employee = getState().entities.employee[ id ]
    if (employee && requiredFields.every(key => employee.hasOwnProperty(key))) {
      return null
    }
    const url = `employee/${id}/`
    return dispatch(load(url, types, Schemas.EMP_DETAIL))
  }
}

export const EMPLOYEES_FILTER_SET = 'EMPLOYEES_FILTER_SET'

export function empFilterSet (nameVal, orgNameVal) {
  return dispatch => dispatch({
    type: EMPLOYEES_FILTER_SET,
    nameVal, orgNameVal
  })
}

export const EMPLOYEES_PAGE_SET = 'EMPLOYEES_PAGE_SET'

export function empPageSet (empActivePage) {
  return dispatch => dispatch({
    type: EMPLOYEES_PAGE_SET,
    empActivePage
  })
}
