import Schemas from '../middleware/schemas'
import { loadThis } from '../main/actions'
import { PLACES_FILTER_INITIAL_STATE } from './reducer'

const PLACE_ENDPOINT = 'place'

export const PLACES_REQUEST = 'PLACES_REQUEST'
export const PLACES_SUCCESS = 'PLACES_SUCCESS'
export const PLACES_FAILURE = 'PLACES_FAILURE'

export function loadPlaces (id = 1, filter = PLACES_FILTER_INITIAL_STATE) {
  const { code, name, addr, ateCode, ateName } = filter
  return loadThis({
    id: id,
    source: 'placesPage',
    types: [ PLACES_REQUEST, PLACES_SUCCESS, PLACES_FAILURE ],
    schema: Schemas.PLACES_PAGE,
    endpoint: `${PLACE_ENDPOINT}/
?code=${code}&name=${name}&addr${addr}
&ate_code=${ateCode}&ate_name=${ateName}&page=${id}`
  })
}

export const PLACES_FILTER_SET = 'PLACES_FILTER_SET'

export function placesFilterSet (placesFilter) {
  return {
    type: PLACES_FILTER_SET,
    payload: placesFilter
  }
}

export const PLACES_PAGE_SET = 'PLACES_PAGE_SET'

export function placesPageSet (placesActivePage) {
  return {
    type: PLACES_PAGE_SET,
    payload: placesActivePage
  }
}