import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { loadOrganisations } from '../actions'
import { organisationsOnPageSelector, countSelector } from '../selectors'
import { Header } from '../../main/components'
import { OrgTable } from '../components'
import Filter from './Filter'
import Pagination from './Pagination'

class Organisations extends Component {
  componentDidMount () {
    this.props.loadOrganisations()
  }

  render () {
    const header = 'Организации сотрудников, участвующих в ГИА 2016'
    const { organisations, count } = this.props
    return (
      <Col lg={12}>
        <Header header={header} subHeader={count}/>
        <Filter />
        <OrgTable organisations={organisations}/>
        <Pagination />
      </Col>
    )
  }
}

Organisations.propTypes = {
  organisations: PropTypes.array.isRequired,
  count: PropTypes.number,
  loadOrganisations: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  organisations: organisationsOnPageSelector(state),
  count: countSelector(state)
})

export default connect(mapStateToProps, {
  loadOrganisations
})(Organisations)
