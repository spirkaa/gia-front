import React from 'react'
import { connect } from 'react-redux'
import { loadOrganisations, orgPageSet } from '../actions'
import PaginationContainer from '../../main/containers/PaginationContainer'
import { ORG_FILTER_INITIAL_STATE } from '../reducer'

const mapStateToProps = (state) => {
  const {
    entities: { orgPage },
    filters: { orgFilter },
    pagination: { orgActivePage }
  } = state
  const { count } = orgPage[ 1 ] || { count: null }
  return ({
    activePage: orgActivePage,
    count,
    filterVals: orgFilter,
    filterDefaultVals: ORG_FILTER_INITIAL_STATE
  })
}

export default connect(mapStateToProps, {
  loadNext: loadOrganisations,
  setPage: orgPageSet
})(PaginationContainer)
