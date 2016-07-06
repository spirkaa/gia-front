import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { loadOrganisations } from '../actions'
import { Header } from '../../main/components'
import { OrgTable } from '../components'
import FilterContainer from './FilterContainer'
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
        <FilterContainer />
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

const mapStateToProps = (state) => {
  const {
    entities: { orgPage, organisation },
    pagination: { orgActivePage }
  } = state
  const { count } = orgPage[ 1 ] || { count: null }
  const currentPage = orgPage[ orgActivePage ] || { results: [] }
  const organisationsOnPage = currentPage.results.map(id => organisation[ id ])
  return ({
    organisations: organisationsOnPage,
    count
  })
}

export default connect(mapStateToProps, {
  loadOrganisations
})(Organisations)
