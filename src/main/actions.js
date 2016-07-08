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
