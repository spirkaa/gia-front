import { CALL_API } from '../middleware/api'
import Schemas from '../middleware/schemas'

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

// Relies on Redux Thunk middleware.
export function loadThis (params) {
  const { source, id, requiredFields = [], types, endpoint, schema } = params
  return (dispatch, getState) => {
    const requestedObject = getState().entities[ source ][ id ]
    if (requestedObject && requiredFields.every(
        key => requestedObject.hasOwnProperty(key))) {
      return null
    }
    return dispatch(load(endpoint, types, schema))
  }
}

export function actionTrigger (type) {
  return {
    type: type
  }
}

export function actionWithPayload (type, payload) {
  return {
    type: type,
    payload: payload
  }
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

export const resetErrorMessage = () =>
  actionTrigger(RESET_ERROR_MESSAGE)

const DATASOURCE_ENDPOINT = 'datasource'

export const DATASOURCES_REQUEST = 'DATASOURCES_REQUEST'
export const DATASOURCES_SUCCESS = 'DATASOURCES_SUCCESS'
export const DATASOURCES_FAILURE = 'DATASOURCES_FAILURE'

export function loadDataSources (id = 1) {
  return loadThis({
    id: id,
    source: 'dataSourcePage',
    types: [ DATASOURCES_REQUEST, DATASOURCES_SUCCESS, DATASOURCES_FAILURE ],
    schema: Schemas.DATASOURCE_PAGE,
    endpoint: `${DATASOURCE_ENDPOINT}/`
  })
}