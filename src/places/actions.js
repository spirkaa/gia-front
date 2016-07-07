import Schemas from '../middleware/schemas'
import load from '../main/actions'
import { PLACES_FILTER_INITIAL_STATE } from './reducer'

export const PLACES_REQUEST = 'PLACES_REQUEST'
export const PLACES_SUCCESS = 'PLACES_SUCCESS'
export const PLACES_FAILURE = 'PLACES_FAILURE'

export function loadPlaces (pageNum = 1, filter = PLACES_FILTER_INITIAL_STATE) {
  const types = [ PLACES_REQUEST, PLACES_SUCCESS, PLACES_FAILURE ]
  const { code, name, addr, ateCode, ateName } = filter
  return (dispatch, getState) => {
    const page = getState().entities.placesPage[ pageNum ]
    if (page) {
      return null
    }
    const url = `place/
?code=${code}&name=${name}&addr${addr}
&ate_code=${ateCode}&ate_name=${ateName}&page=${pageNum}`
    return dispatch(load(url, types, Schemas.PLACES_PAGE))
  }
}

export const PLACE_REQUEST = 'PLACE_REQUEST'
export const PLACE_SUCCESS = 'PLACE_SUCCESS'
export const PLACE_FAILURE = 'PLACE_FAILURE'

// export function loadPlaceDetail (id, requiredFields = []) {
//   const types = [ PLACE_REQUEST, PLACE_SUCCESS, PLACE_FAILURE ]
//   return (dispatch, getState) => {
//     const place = getState().entities.place[ id ]
//     if (place && requiredFields.every(key => place.hasOwnProperty(key))) {
//       return null
//     }
//     const url = `place/${id}/`
//     return dispatch(load(url, types, Schemas.PLACES_DETAIL))
//   }
// }

export const PLACES_FILTER_SET = 'PLACES_FILTER_SET'

export function placesFilterSet (placesFilter) {
  return dispatch => dispatch({
    type: PLACES_FILTER_SET,
    placesFilter
  })
}

export const PLACES_PAGE_SET = 'PLACES_PAGE_SET'

export function placesPageSet (placesActivePage) {
  return dispatch => dispatch({
    type: PLACES_PAGE_SET,
    placesActivePage
  })
}