import createDeepEqualSelector, {
  getPlacesPage,
  getPlace,
  getTerritory,
  getPlacesActivePage,
  getPlacesFilter,
} from "../main/selectors"

const getCount = (state) => state.entities.placesPage[1] || { count: null }

export const placesActivePageSelector = getPlacesActivePage

export const placesFilterSelector = getPlacesFilter

export const countSelector = createDeepEqualSelector(getCount, (page) => page.count)

const currentPageSelector = createDeepEqualSelector(
  getPlacesPage,
  placesActivePageSelector,
  (page, number) => page[number] || { results: [] },
)

export const placesOnPageSelector = createDeepEqualSelector(
  currentPageSelector,
  getPlace,
  getTerritory,
  (page, place, territory) =>
    page.results
      .map((id) => place[id])
      .map((place) => ({ ...place, ate: territory[place.ate] })),
)
