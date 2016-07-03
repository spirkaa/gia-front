import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadOrganisations, orgPageSet } from '../actions'
import { PaginationAdvanced } from '../../main/components'

class PaginationContainer extends Component {
  constructor (props) {
    super(props)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
  }

  handlePaginationClick (pageNum) {
    if (pageNum !== this.props.orgActivePage) {
      const { orgPageSet, loadOrganisations, nameVal } = this.props
      orgPageSet(pageNum)
      if (nameVal !== '') {
        loadOrganisations(pageNum, nameVal)
      } else {
        loadOrganisations(pageNum)
      }
    }
  }

  render () {
    const { orgActivePage, count } = this.props
    return (count
        ? <PaginationAdvanced
        onPaginationClick={this.handlePaginationClick}
        activePage={orgActivePage}
        pageCount={Math.ceil(count / 50)}/>
        : null
    )
  }
}

PaginationContainer.propTypes = {
  orgActivePage: PropTypes.number.isRequired,
  count: PropTypes.number,
  nameVal: PropTypes.string.isRequired,
  loadOrganisations: PropTypes.func.isRequired,
  orgPageSet: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    entities: { orgPage },
    filters: { orgFilter: { nameVal } },
    pagination: { orgActivePage }
  } = state
  const { count } = orgPage[ 1 ] || { count: null }
  return ({
    orgActivePage,
    count,
    nameVal
  })
}

export default connect(mapStateToProps, {
  loadOrganisations,
  orgPageSet
})(PaginationContainer)
