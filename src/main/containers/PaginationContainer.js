import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'
import { PaginationAdvanced } from '../../main/components'

export default class PaginationContainer extends Component {
  constructor (props) {
    super(props)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
  }

  handlePaginationClick (pageNum) {
    if (pageNum !== this.props.activePage) {
      const { setPage, loadNext, filterVals, filterDefaultVals } = this.props
      setPage(pageNum)
      if (!isEqual(filterVals, filterDefaultVals)) {
        loadNext(pageNum, filterVals)
      } else {
        loadNext(pageNum)
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
  filterVals: PropTypes.object.isRequired,
  filterDefaultVals: PropTypes.object.isRequired,
  loadNext: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired
}
