import Schemas from "../middleware/schemas"
import { loadThis, actionTrigger, actionWithPayload } from "../main/actions"
import { PLACES_FILTER_INITIAL_STATE } from "./reducer"

const PLACE_ENDPOINT = "place"

export const PLACES_REQUEST = "PLACES_REQUEST"
export const PLACES_SUCCESS = "PLACES_SUCCESS"
export const PLACES_FAILURE = "PLACES_FAILURE"

export const PLACES_FILTER_SET = "PLACES_FILTER_SET"
export const PLACES_FILTER_CLEAR_PAGES = "PLACES_FILTER_CLEAR_PAGES"
export const PLACES_PAGE_SET = "PLACES_PAGE_SET"

export function loadPlaces(id = 1, filter = PLACES_FILTER_INITIAL_STATE) {
  const { search } = filter
  return loadThis({
    id: id,
    source: "placesPage",
    types: [PLACES_REQUEST, PLACES_SUCCESS, PLACES_FAILURE],
    schema: Schemas.PLACES_PAGE,
    endpoint: `${PLACE_ENDPOINT}/?search=${search}&page=${id}`,
  })
}

export const placesFilterSet = (filter) => actionWithPayload(PLACES_FILTER_SET, filter)

export const placesFilterClearPages = () => actionTrigger(PLACES_FILTER_CLEAR_PAGES)

export const placesPageSet = (page) => actionWithPayload(PLACES_PAGE_SET, page)
