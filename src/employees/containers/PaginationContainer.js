import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadEmployees, setActivePage } from '../actions'
import { PaginationAdvanced } from '../../main/components'

class PaginationContainer extends Component {
  constructor (props) {
    super(props)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
  }

  handlePaginationClick (pageNum) {
    if (pageNum !== this.props.activePage) {
      const { setActivePage, loadEmployees, nameVal, orgNameVal } = this.props
      setActivePage(pageNum)
      if (nameVal !== '' || orgNameVal !== '') {
        loadEmployees(pageNum, nameVal, orgNameVal)
      } else {
        loadEmployees(pageNum)
      }
    }
  }

  render () {
    const { activePage, count } = this.props
    return (count
        ? <PaginationAdvanced
        onPaginationClick={this.handlePaginationClick}
        activePage={activePage}
        pageCount={Math.ceil(count / 50)}/>
        : null
    )
  }
}

PaginationContainer.propTypes = {
  activePage: PropTypes.number.isRequired,
  count: PropTypes.number,
  nameVal: PropTypes.string.isRequired,
  orgNameVal: PropTypes.string.isRequired,
  loadEmployees: PropTypes.func.isRequired,
  setActivePage: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    entities: { page },
    filter: { nameVal, orgNameVal },
    activePage
  } = state
  const { count } = page[ 1 ] || { count: null }
  return ({
    activePage,
    count,
    nameVal,
    orgNameVal
  })
}

export default connect(mapStateToProps, {
  loadEmployees,
  setActivePage
})(PaginationContainer)
