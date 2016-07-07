import React from 'react'
import { connect } from 'react-redux'
import { loadPlaces, placesPageSet } from '../actions'
import PaginationContainer from '../../main/containers/PaginationContainer'
import { PLACES_FILTER_INITIAL_STATE } from '../reducer'

const mapStateToProps = (state) => {
  const {
    entities: { placesPage },
    filters: { placesFilter },
    pagination: { placesActivePage }
  } = state
  const { count } = placesPage[ 1 ] || { count: null }
  return ({
    activePage: placesActivePage,
    count,
    filterVals: placesFilter,
    filterDefaultVals: PLACES_FILTER_INITIAL_STATE
  })
}

export default connect(mapStateToProps, {
  loadNext: loadPlaces,
  setPage: placesPageSet
})(PaginationContainer)
