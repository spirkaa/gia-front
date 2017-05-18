import React from 'react' // eslint-disable-line
import { connect } from 'react-redux'
import PaginationContainer from '../../main/containers/PaginationContainer'
import { loadEmployees, empPageSet } from '../actions'
import { empFilterSelector, empActivePageSelector, countSelector } from '../selectors'
import { EMP_FILTER_INITIAL_STATE } from '../reducer'

const mapStateToProps = (state) => ({
  activePage: empActivePageSelector(state),
  count: countSelector(state),
  filterVals: empFilterSelector(state),
  filterDefaultVals: EMP_FILTER_INITIAL_STATE
})

export default connect(mapStateToProps, {
  loadNext: loadEmployees,
  setPage: empPageSet
})(PaginationContainer)
