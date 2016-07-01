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

export const FILTER_CLEAR_PAGES = 'FILTER_CLEAR_PAGES'

export function filterClearPages () {
  return dispatch => dispatch({
    type: FILTER_CLEAR_PAGES
  })
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

export function resetErrorMessage () {
  return {
    type: RESET_ERROR_MESSAGE
  }
}
