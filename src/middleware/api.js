import { normalize } from 'normalizr'

const API_ROOT = (
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8000/api/v1/'
    : 'https://gia-api.devmem.ru/api/v1/'
)

let logger = () => null
if (process.env.NODE_ENV !== 'production') {
  logger = (json, norm) => {
    console.groupCollapsed('callApi')
    console.log('%cresponse', 'color:#9E9E9E;', json)
    console.log('%cnormalize', 'color:#4CAF50;', norm)
    console.groupEnd()
  }
}

function callApi (endpoint, schema, method, data) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  const request = { method, headers }

  if (data.jwt) {
    headers.Authorization = `JWT ${data.jwt}`
  }

  if (method !== 'GET') {
    request.body = JSON.stringify(data)
  }

  const normalizeResp = (json) => {
    if (schema) {
      const normalized = normalize(json, schema)
      logger(json, normalized)
      return { ...normalized }
    }
    return json
  }

  return fetch(fullUrl, request)
    .then(response =>
      response.ok
        ? response.json()
        : response.json().then(err => Promise.reject(err)))
    .then(normalizeResp)
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[ CALL_API ]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  const { endpoint, schema, types, method, data } = callAPI

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith (data) {
    const finalAction = { ...action, ...data }
    delete finalAction[ CALL_API ]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema, method, data).then(
    response => next(actionWith({
      type: successType,
      response,
    })),
    error => next(actionWith({
      type: failureType,
      response: error,
      error: true,
    })),
  )
}