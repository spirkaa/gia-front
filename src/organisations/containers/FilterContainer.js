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

  handleFilterChange ({ nameVal }) {
    if (nameVal !== this.props.nameVal) {
      const { orgFilterSet, loadOrganisations, orgFilterClearPages, orgPageSet } = this.props
      orgFilterSet(nameVal)
      orgFilterClearPages()
      loadOrganisations(1, nameVal)
      orgPageSet(1)
    }
  }

  render () {
    const { nameVal } = this.props
    return (
      <Filter
        nameVal={nameVal}
        onChange={this.handleFilterChange}
      />
    )
  }
}

FilterContainer.propTypes = {
  nameVal: PropTypes.string.isRequired,
  loadOrganisations: PropTypes.func.isRequired,
  orgFilterSet: PropTypes.func.isRequired,
  orgFilterClearPages: PropTypes.func.isRequired,
  orgPageSet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    filters: { orgFilter: { nameVal } }
  } = state
  return ({
    nameVal
  })
}

export default connect(mapStateToProps, {
  loadOrganisations,
  orgFilterSet,
  orgFilterClearPages,
  orgPageSet
})(FilterContainer)