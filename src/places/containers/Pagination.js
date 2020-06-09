import React from "react" // eslint-disable-line
import { connect } from "react-redux"
import PaginationContainer from "../../main/containers/PaginationContainer"
import { loadPlaces, placesPageSet } from "../actions"
import {
  placesFilterSelector,
  placesActivePageSelector,
  countSelector,
} from "../selectors"
import { PLACES_FILTER_INITIAL_STATE } from "../reducer"

const mapStateToProps = (state) => ({
  activePage: placesActivePageSelector(state),
  count: countSelector(state),
  filterVals: placesFilterSelector(state),
  filterDefaultVals: PLACES_FILTER_INITIAL_STATE,
})

export default connect(mapStateToProps, {
  loadNext: loadPlaces,
  setPage: placesPageSet,
})(PaginationContainer)
