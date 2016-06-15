import {
  EMPLOYEES_REQUEST, EMPLOYEES_SUCCESS, EMPLOYEES_FAILURE,
  EMPLOYEE_REQUEST, EMPLOYEE_SUCCESS, EMPLOYEE_FAILURE
} from './actions'

// TODO: (loading: true) не может быть в INITIAL_STATE! найти решение для асинхронной загрузки во время маунта компонента
const INITIAL_STATE = {
  employeesList: { employees: [], error: null, loading: false, pageCount: 0 },
  activeEmployee: { employee: [], error: null, loading: false }
}

export default function (state = INITIAL_STATE, action) {
  let error
  const stateList = state.employeesList
  switch (action.type) {
    case EMPLOYEES_REQUEST:// start fetching posts and set loading = true
      return {
        ...state,
        employeesList: { employees: stateList.employees, error: null, loading: true, pageCount: stateList.pageCount }
      }
    case EMPLOYEES_SUCCESS:// return list of posts and make loading = false
      return {
        ...state,
        employeesList: { employees: action.response, error: null, loading: false, pageCount: stateList.pageCount + 1 }
      }
    case EMPLOYEES_FAILURE:// return error and make loading = false
      error = action.error || { message: action.error.message } // 2nd one is network or server down errors
      return { ...state, employeesList: { employees: stateList.employees, error: error, loading: false } }

    case EMPLOYEE_REQUEST:
      return { ...state, activeEmployee: { employee: [], error: null, loading: true } }
    case EMPLOYEE_SUCCESS:
      return { ...state, activeEmployee: { employee: action.response, error: null, loading: false } }
    case EMPLOYEE_FAILURE:
      error = action.error || { message: action.error.message }
      return { ...state, activeEmployee: { employee: [], error: error, loading: false } }

    default:
      return state
  }
}