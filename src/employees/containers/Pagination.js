import React from 'react'
import { connect } from 'react-redux'
import { loadEmployees, empPageSet } from '../actions'
import PaginationContainer from '../../main/containers/PaginationContainer'
import { EMP_FILTER_INITIAL_STATE } from '../reducer'

const mapStateToProps = (state) => {
  const {
    entities: { empPage },
    filters: { empFilter },
    pagination: { empActivePage }
  } = state
  const { count } = empPage[ 1 ] || { count: null }
  return ({
    activePage: empActivePage,
    count,
    filterVals: empFilter,
    filterDefaultVals: EMP_FILTER_INITIAL_STATE
  })
}

export default connect(mapStateToProps, {
  loadNext: loadEmployees,
  setPage: empPageSet
})(PaginationContainer)
