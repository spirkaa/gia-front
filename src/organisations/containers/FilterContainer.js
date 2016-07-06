import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadOrganisations, orgFilterSet, orgPageSet } from '../actions'
import { orgFilterClearPages } from '../../main/actions'
import { Filter } from '../components'

class FilterContainer extends Component {
  constructor (props) {
    super(props)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange (orgFilter) {
    if (!isEqual(orgFilter, this.props.orgFilter)) {
      const { orgFilterSet, loadOrganisations, orgFilterClearPages, orgPageSet } = this.props
      orgFilterSet(orgFilter)
      orgFilterClearPages()
      loadOrganisations(1, orgFilter)
      orgPageSet(1)
    }
  }

  render () {
    const { orgFilter } = this.props
    return (
      <Filter
        orgFilter={orgFilter}
        onChange={this.handleFilterChange}
      />
    )
  }
}

FilterContainer.propTypes = {
  orgFilter: PropTypes.object.isRequired,
  loadOrganisations: PropTypes.func.isRequired,
  orgFilterSet: PropTypes.func.isRequired,
  orgFilterClearPages: PropTypes.func.isRequired,
  orgPageSet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({ orgFilter: state.filters.orgFilter })

export default connect(mapStateToProps, {
  loadOrganisations,
  orgFilterSet,
  orgFilterClearPages,
  orgPageSet
})(FilterContainer)