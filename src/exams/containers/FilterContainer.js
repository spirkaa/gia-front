import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadExams, examFilterSet, examPageSet } from '../actions'
import { examFilterClearPages } from '../../main/actions'
import FilterContainer from '../../main/containers/FilterContainer'
import { Filter } from '../components'

const mapStateToProps = (state) => ({
  Filter: Filter,
  filterVals: state.filters.examFilter
})

export default connect(mapStateToProps, {
  loadFiltered: loadExams,
  filterSet: examFilterSet,
  filterClearPages: examFilterClearPages,
  pageSet: examPageSet
})(FilterContainer)