import React from 'react'
import { connect } from 'react-redux'
import { loadExams, examPageSet } from '../actions'
import PaginationContainer from '../../main/containers/PaginationContainer'
import { EXAM_FILTER_INITIAL_STATE } from '../reducer'

const mapStateToProps = (state) => {
  const {
    entities: { examPage },
    filters: { examFilter },
    pagination: { examActivePage }
  } = state
  const { count } = examPage[ 1 ] || { count: null }
  return ({
    activePage: examActivePage,
    count,
    filterVals: examFilter,
    filterDefaultVals: EXAM_FILTER_INITIAL_STATE
  })
}

export default connect(mapStateToProps, {
  loadNext: loadExams,
  setPage: examPageSet
})(PaginationContainer)
