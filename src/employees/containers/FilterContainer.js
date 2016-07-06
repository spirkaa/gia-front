import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadEmployees, empFilterSet, empPageSet } from '../actions'
import { empFilterClearPages } from '../../main/actions'
import { Filter } from '../components'

class FilterContainer extends Component {
  constructor (props) {
    super(props)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange (empFilter) {
    if (!isEqual(empFilter, this.props.empFilter)) {
      const { empFilterSet, loadEmployees, empFilterClearPages, empPageSet } = this.props
      empFilterSet(empFilter)
      empFilterClearPages()
      loadEmployees(1, empFilter)
      empPageSet(1)
    }
  }

  render () {
    const { empFilter } = this.props
    return (
      <Filter
        empFilter={empFilter}
        onChange={this.handleFilterChange}
      />
    )
  }
}

FilterContainer.propTypes = {
  empFilter: PropTypes.object.isRequired,
  loadEmployees: PropTypes.func.isRequired,
  empFilterSet: PropTypes.func.isRequired,
  empFilterClearPages: PropTypes.func.isRequired,
  empPageSet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({ empFilter: state.filters.empFilter })

export default connect(mapStateToProps, {
  loadEmployees,
  empFilterSet,
  empFilterClearPages,
  empPageSet
})(FilterContainer)