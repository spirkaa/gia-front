import { connect } from "react-redux"
import FilterContainer from "../../main/containers/FilterContainerSingle"
import {
  loadEmployees,
  empFilterSet,
  empFilterClearPages,
  empPageSet,
} from "../actions"
import { empFilterSelector } from "../selectors"

const mapStateToProps = (state) => ({
  filterVals: empFilterSelector(state),
})

export default connect(mapStateToProps, {
  loadFiltered: loadEmployees,
  filterSet: empFilterSet,
  filterClearPages: empFilterClearPages,
  pageSet: empPageSet,
})(FilterContainer)
