import { CALL_API } from '../middleware/api'
import Schemas from '../middleware/schemas'

// Relies on the custom API middleware defined in ../middleware/api.js.
export default function load (endpoint, types, schema = null, data = {}, method = 'GET') {
  return {
    [CALL_API]: {
      types: types,
      endpoint: endpoint,
      schema: schema,
      data: data,
      method: method,
    },
  }
}

export function authApi (params) {
  const { endpoint, types, data, method } = params
  const schema = null
  return dispatch => {
    dispatch(load(endpoint, types, schema, data, method))
  }
}

// Relies on Redux Thunk middleware.
export function loadThis (params) {
  const { source, id, requiredFields = [], types, endpoint, schema, data, method } = params
  return (dispatch, getState) => {
    const requestedObject = getState().entities[ source ][ id ]
    if (requestedObject && requiredFields.every(
      key => requestedObject.hasOwnProperty(key))) {
        return null
    }
    return dispatch(load(endpoint, types, schema, data, method))
  }
}

export function actionTrigger (type) {
  return {
    type: type,
  }
}

export function actionWithPayload (type, payload) {
  return {
    type: type,
    payload: payload,
  }
}

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
    endpoint: `${DATASOURCE_ENDPOINT}/`,
  })
}