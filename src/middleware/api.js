import { Schema, arrayOf, normalize } from 'normalizr'
import 'isomorphic-fetch'

// const API_ROOT = location.href.indexOf('localhost') > 0 ? 'http://localhost:8000/api/v1/' : '/api/v1/'
const API_ROOT = 'http://localhost:8000/api/v1/'

function callApi (endpoint, schema) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(fullUrl)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      console.log('-------')
      console.log('response:', json)
      console.log('normalizr:', normalize(json, schema))
      console.log('-------')
      return Object.assign({}, normalize(json, schema))
    })
}

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[ 2 ]) return ''
  return decodeURIComponent(results[ 2 ].replace(/\+/g, ' '))
}

function generateSlug (entity) {
  const { next, previous } = entity
  const pageNum = direction => getParameterByName('page', direction)
  if (!next && !previous) return 1
  if (!next && previous) {
    if (!pageNum(previous)) return 2
    return (+pageNum(previous) + 1)
  }
  return (+pageNum(next) - 1)
}

const empPageSchema = new Schema('empPage', { idAttribute: generateSlug })
const orgPageSchema = new Schema('orgPage', { idAttribute: generateSlug })
const employeeSchema = new Schema('employee', { idAttribute: 'id' })
const examSchema = new Schema('exam', { idAttribute: 'id' })
const dateSchema = new Schema('date', { idAttribute: 'id' })
const levelSchema = new Schema('level', { idAttribute: 'id' })
const positionSchema = new Schema('position', { idAttribute: 'id' })
const organisationSchema = new Schema('organisation', { idAttribute: 'id' })
const placeSchema = new Schema('place', { idAttribute: 'id' })
const territorySchema = new Schema('territory', { idAttribute: 'id' })

placeSchema.define({
  ate: territorySchema
})

examSchema.define({
  date: dateSchema,
  level: levelSchema,
  position: positionSchema,
  place: placeSchema
})

employeeSchema.define({
  org: organisationSchema,
  exams: arrayOf(examSchema)
})

organisationSchema.define({
  employees: arrayOf(employeeSchema)
})

empPageSchema.define({
  results: arrayOf(employeeSchema)
})

orgPageSchema.define({
  results: arrayOf(organisationSchema)
})

export const Schemas = {
  EMP_PAGE: empPageSchema,
  ORG_PAGE: orgPageSchema,
  EMP_DETAIL: employeeSchema,
  ORG_DETAIL: organisationSchema
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

  let { endpoint } = callAPI
  const { schema, types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
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
    const finalAction = Object.assign({}, action, data)
    delete finalAction[ CALL_API ]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
