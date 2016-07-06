import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'

export default class FilterContainer extends Component {
  constructor (props) {
    super(props)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange (filterVals) {
    if (!isEqual(filterVals, this.props.filterVals)) {
      const { filterSet, loadFiltered, filterClearPages, pageSet } = this.props
      filterSet(filterVals)
      filterClearPages()
      loadFiltered(1, filterVals)
      pageSet(1)
    }
  }

  render () {
    const { Filter, filterVals } = this.props
    return (
      <Filter
        filterVals={filterVals}
        onChange={this.handleFilterChange}
      />
    )
  }
}

FilterContainer.propTypes = {
  Filter: PropTypes.any.isRequired,
  filterVals: PropTypes.object.isRequired,
  loadFiltered: PropTypes.func.isRequired,
  filterSet: PropTypes.func.isRequired,
  filterClearPages: PropTypes.func.isRequired,
  pageSet: PropTypes.func.isRequired
}
