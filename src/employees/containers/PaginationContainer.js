import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadEmployees, empPageSet } from '../actions'
import { PaginationAdvanced } from '../../main/components'

class PaginationContainer extends Component {
  constructor (props) {
    super(props)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
  }

  handlePaginationClick (pageNum) {
    if (pageNum !== this.props.empActivePage) {
      const { empPageSet, loadEmployees, nameVal, orgNameVal } = this.props
      empPageSet(pageNum)
      if (nameVal !== '' || orgNameVal !== '') {
        loadEmployees(pageNum, nameVal, orgNameVal)
      } else {
        loadEmployees(pageNum)
      }
    }
  }

  render () {
    const { empActivePage, count } = this.props
    return (count
        ? <PaginationAdvanced
        onPaginationClick={this.handlePaginationClick}
        activePage={empActivePage}
        pageCount={Math.ceil(count / 50)}/>
        : null
    )
  }
}

PaginationContainer.propTypes = {
  empActivePage: PropTypes.number.isRequired,
  count: PropTypes.number,
  nameVal: PropTypes.string.isRequired,
  orgNameVal: PropTypes.string.isRequired,
  loadEmployees: PropTypes.func.isRequired,
  empPageSet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    entities: { empPage },
    filters: { empFilter: { nameVal, orgNameVal } },
    pagination: { empActivePage }
  } = state
  const { count } = empPage[ 1 ] || { count: null }
  return ({
    empActivePage,
    count,
    nameVal,
    orgNameVal
  })
}

export default connect(mapStateToProps, {
  loadEmployees,
  empPageSet
})(PaginationContainer)
