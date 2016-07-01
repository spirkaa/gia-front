import { Schemas } from '../middleware/api'
import load from '../main/actions'

export const EMPLOYEES_REQUEST = 'EMPLOYEES_REQUEST'
export const EMPLOYEES_SUCCESS = 'EMPLOYEES_SUCCESS'
export const EMPLOYEES_FAILURE = 'EMPLOYEES_FAILURE'

// Relies on Redux Thunk middleware.
export function loadEmployees (pageNum = 1, nameVal = '', orgNameVal = '') {
  const types = [ EMPLOYEES_REQUEST, EMPLOYEES_SUCCESS, EMPLOYEES_FAILURE ]
  return (dispatch, getState) => {
    const page = getState().entities.page[ pageNum ]
    if (page) {
      return null
    }
    const url = `employee/?name=${nameVal}&org_name=${orgNameVal}&page=${pageNum}`
    return dispatch(load(url, types, Schemas.PAGE))
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
    return dispatch(load(url, types, Schemas.DETAIL))
  }
}

export const FILTER_UPDATE_VALUE = 'FILTER_UPDATE_VALUE'

export function setEmployeesFilter (nameVal, orgNameVal) {
  return dispatch => dispatch({
    type: FILTER_UPDATE_VALUE,
    nameVal, orgNameVal
  })
}

export const ACTIVE_PAGE_SET = 'ACTIVE_PAGE_SET'

export function setActivePage (activePage) {
  return dispatch => dispatch({
    type: ACTIVE_PAGE_SET,
    activePage
  })
}
