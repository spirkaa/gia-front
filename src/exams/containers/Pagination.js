import React from "react" // eslint-disable-line
import { connect } from "react-redux"
import PaginationContainer from "../../main/containers/PaginationContainer"
import { loadExams, examPageSet } from "../actions"
import { examFilterSelector, examActivePageSelector, countSelector } from "../selectors"
import { EXAM_FILTER_INITIAL_STATE } from "../reducer"

const mapStateToProps = (state) => ({
  activePage: examActivePageSelector(state),
  count: countSelector(state),
  filterVals: examFilterSelector(state),
  filterDefaultVals: EXAM_FILTER_INITIAL_STATE,
})

export default connect(mapStateToProps, {
  loadNext: loadExams,
  setPage: examPageSet,
})(PaginationContainer)
