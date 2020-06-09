import React from "react" // eslint-disable-line
import { connect } from "react-redux"
import PaginationContainer from "../../main/containers/PaginationContainer"
import { loadOrganisations, orgPageSet } from "../actions"
import { orgFilterSelector, orgActivePageSelector, countSelector } from "../selectors"
import { ORG_FILTER_INITIAL_STATE } from "../reducer"

const mapStateToProps = (state) => ({
  activePage: orgActivePageSelector(state),
  count: countSelector(state),
  filterVals: orgFilterSelector(state),
  filterDefaultVals: ORG_FILTER_INITIAL_STATE,
})

export default connect(mapStateToProps, {
  loadNext: loadOrganisations,
  setPage: orgPageSet,
})(PaginationContainer)
