import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadEmployees, setEmployeesFilter, setActivePage } from '../actions'
import { filterClearPages } from '../../main/actions'
import { Filter } from '../components'

class FilterContainer extends Component {
  constructor (props) {
    super(props)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange ({ nameVal, orgNameVal }) {
    if (nameVal !== this.props.nameVal || orgNameVal !== this.props.orgNameVal) {
      const { setEmployeesFilter, loadEmployees, filterClearPages, setActivePage } = this.props
      setEmployeesFilter(nameVal, orgNameVal)
      filterClearPages()
      loadEmployees(1, nameVal, orgNameVal)
      setActivePage(1)
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
  setEmployeesFilter: PropTypes.func.isRequired,
  filterClearPages: PropTypes.func.isRequired,
  setActivePage: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    filter: { nameVal, orgNameVal }
  } = state

  return ({
    nameVal,
    orgNameVal
  })
}

export default connect(mapStateToProps, {
  loadEmployees,
  setEmployeesFilter,
  filterClearPages,
  setActivePage
})(FilterContainer)