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
  return {
    type: EMPLOYEES_FILTER_CLEAR_PAGES
  }
}

export const ORGANISATIONS_FILTER_CLEAR_PAGES = 'ORGANISATIONS_FILTER_CLEAR_PAGES'

export function orgFilterClearPages () {
  return {
    type: ORGANISATIONS_FILTER_CLEAR_PAGES
  }
}

export const EXAMS_FILTER_CLEAR_PAGES = 'EXAMS_FILTER_CLEAR_PAGES'

export function examFilterClearPages () {
  return {
    type: EXAMS_FILTER_CLEAR_PAGES
  }
}

export const PLACES_FILTER_CLEAR_PAGES = 'PLACES_FILTER_CLEAR_PAGES'

export function placesFilterClearPages () {
  return {
    type: PLACES_FILTER_CLEAR_PAGES
  }
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

export function resetErrorMessage () {
  return {
    type: RESET_ERROR_MESSAGE
  }
}
