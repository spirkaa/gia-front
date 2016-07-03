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

  handleFilterChange ({ nameVal, orgNameVal }) {
    if (nameVal !== this.props.nameVal || orgNameVal !== this.props.orgNameVal) {
      const { empFilterSet, loadEmployees, empFilterClearPages, empPageSet } = this.props
      empFilterSet(nameVal, orgNameVal)
      empFilterClearPages()
      loadEmployees(1, nameVal, orgNameVal)
      empPageSet(1)
    }
  }

  render () {
    const { nameVal, orgNameVal } = this.props
    return (
      <Filter
        nameVal={nameVal}
        orgNameVal={orgNameVal}
        onChange={this.handleFilterChange}
      />
    )
  }
}

FilterContainer.propTypes = {
  nameVal: PropTypes.string.isRequired,
  orgNameVal: PropTypes.string.isRequired,
  loadEmployees: PropTypes.func.isRequired,
  empFilterSet: PropTypes.func.isRequired,
  empFilterClearPages: PropTypes.func.isRequired,
  empPageSet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    filters: { empFilter: { nameVal, orgNameVal } }
  } = state

  return ({
    nameVal,
    orgNameVal
  })
}

export default connect(mapStateToProps, {
  loadEmployees,
  empFilterSet,
  empFilterClearPages,
  empPageSet
})(FilterContainer)