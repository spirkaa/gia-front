import React from 'react'
import { connect } from 'react-redux'
import FilterContainer from '../../main/containers/FilterContainer'
import { loadExams, examFilterSet, examFilterClearPages, examPageSet } from '../actions'
import { examFilterSelector } from '../selectors'
import { Filter } from '../components'

const mapStateToProps = (state) => ({
  Filter: Filter,
  filterVals: examFilterSelector(state)
})

export default connect(mapStateToProps, {
  loadFiltered: loadExams,
  filterSet: examFilterSet,
  filterClearPages: examFilterClearPages,
  pageSet: examPageSet
})(FilterContainer)