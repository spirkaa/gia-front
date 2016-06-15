import { CALL_API } from '../middleware/api'

export const EMPLOYEES_REQUEST = 'EMPLOYEES_REQUEST'
export const EMPLOYEES_SUCCESS = 'EMPLOYEES_SUCCESS'
export const EMPLOYEES_FAILURE = 'EMPLOYEES_FAILURE'

// Relies on the custom API middleware defined in ../middleware/api.js.
function load (endpoint, types) {
  return {
    [CALL_API]: {
      types: types,
      endpoint: endpoint
    }
  }
}

// Relies on Redux Thunk middleware.
export function loadEmployees (url, nextPage) {
  const types = [ EMPLOYEES_REQUEST, EMPLOYEES_SUCCESS, EMPLOYEES_FAILURE ]
  return (dispatch, getState) => {
    const { pageCount = 0 } = getState().data.employeesList || {}
    if (pageCount > 0 && !nextPage) {
      return null
    }
    return dispatch(load(url, types))
  }
}

export const EMPLOYEE_REQUEST = 'EMPLOYEE_REQUEST'
export const EMPLOYEE_SUCCESS = 'EMPLOYEE_SUCCESS'
export const EMPLOYEE_FAILURE = 'EMPLOYEE_FAILURE'

export function loadEmployeeDetail (id) {
  const types = [ EMPLOYEE_REQUEST, EMPLOYEE_SUCCESS, EMPLOYEE_FAILURE ]
  return (dispatch, getState) => {
    const user = getState().data.activeEmployee.employee[ 'id' ]
    if (user === +id) {
      return null
    }
    const url = `employee/${id}`
    return dispatch(load(url, types))
  }
}