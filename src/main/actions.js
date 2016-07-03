import { CALL_API } from '../middleware/api'

// Relies on the custom API middleware defined in ../middleware/api.js.
export default function load (endpoint, types, schema) {
  return {
    [CALL_API]: {
      types: types,
      endpoint: endpoint,
      schema: schema
    }
  }
}

export const EMPLOYEES_FILTER_CLEAR_PAGES = 'EMPLOYEES_FILTER_CLEAR_PAGES'

export function empFilterClearPages () {
  return dispatch => dispatch({
    type: EMPLOYEES_FILTER_CLEAR_PAGES
  })
}

export const ORGANISATIONS_FILTER_CLEAR_PAGES = 'ORGANISATIONS_FILTER_CLEAR_PAGES'

export function orgFilterClearPages () {
  return dispatch => dispatch({
    type: ORGANISATIONS_FILTER_CLEAR_PAGES
  })
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

export function resetErrorMessage () {
  return {
    type: RESET_ERROR_MESSAGE
  }
}
