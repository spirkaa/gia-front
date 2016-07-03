import { Schemas } from '../middleware/api'
import load from '../main/actions'

export const ORGANISATIONS_REQUEST = 'ORGANISATIONS_REQUEST'
export const ORGANISATIONS_SUCCESS = 'ORGANISATIONS_SUCCESS'
export const ORGANISATIONS_FAILURE = 'ORGANISATIONS_FAILURE'

export function loadOrganisations (pageNum = 1, nameVal = '') {
  const types = [ ORGANISATIONS_REQUEST, ORGANISATIONS_SUCCESS, ORGANISATIONS_FAILURE ]
  return (dispatch, getState) => {
    const page = getState().entities.orgPage[ pageNum ]
    if (page) {
      return null
    }
    const url = `organisation/?name=${nameVal}&page=${pageNum}`
    return dispatch(load(url, types, Schemas.ORG_PAGE))
  }
}

export const ORGANISATION_REQUEST = 'ORGANISATION_REQUEST'
export const ORGANISATION_SUCCESS = 'ORGANISATION_SUCCESS'
export const ORGANISATION_FAILURE = 'ORGANISATION_FAILURE'

export function loadOrgDetail (id, requiredFields = []) {
  const types = [ ORGANISATION_REQUEST, ORGANISATION_SUCCESS, ORGANISATION_FAILURE ]
  return (dispatch, getState) => {
    const organisation = getState().entities.organisation[ id ]
    if (organisation && requiredFields.every(key => organisation.hasOwnProperty(key))) {
      return null
    }
    const url = `organisation/${id}/`
    return dispatch(load(url, types, Schemas.ORG_DETAIL))
  }
}

export const ORGANISATIONS_FILTER_SET = 'ORGANISATIONS_FILTER_SET'

export function orgFilterSet (nameVal) {
  return dispatch => dispatch({
    type: ORGANISATIONS_FILTER_SET,
    nameVal
  })
}

export const ORGANISATIONS_PAGE_SET = 'ORGANISATIONS_PAGE_SET'

export function orgPageSet (orgActivePage) {
  return dispatch => dispatch({
    type: ORGANISATIONS_PAGE_SET,
    orgActivePage
  })
}