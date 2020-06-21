import { connect } from "react-redux"
import FilterContainer from "../../main/containers/FilterContainerSingle"
import {
  loadPlaces,
  placesFilterSet,
  placesFilterClearPages,
  placesPageSet,
} from "../actions"
import { placesFilterSelector } from "../selectors"

const mapStateToProps = (state) => ({
  filterVals: placesFilterSelector(state),
})

export default connect(mapStateToProps, {
  loadFiltered: loadPlaces,
  filterSet: placesFilterSet,
  filterClearPages: placesFilterClearPages,
  pageSet: placesPageSet,
})(FilterContainer)
