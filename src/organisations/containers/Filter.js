import { connect } from "react-redux"
import FilterContainer from "../../main/containers/FilterContainerSingle"
import {
  loadOrganisations,
  orgFilterSet,
  orgFilterClearPages,
  orgPageSet,
} from "../actions"
import { orgFilterSelector } from "../selectors"

const mapStateToProps = (state) => ({
  filterVals: orgFilterSelector(state),
})

export default connect(mapStateToProps, {
  loadFiltered: loadOrganisations,
  filterSet: orgFilterSet,
  filterClearPages: orgFilterClearPages,
  pageSet: orgPageSet,
})(FilterContainer)
