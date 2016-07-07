import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { loadPlaces } from '../actions'
import { Header } from '../../main/components'
import { PlacesTable } from '../components'
import Filter from './Filter'
import Pagination from './Pagination'

class Places extends Component {
  componentDidMount () {
    this.props.loadPlaces()
  }

  render () {
    const header = 'Пункты проведения экзамена'
    const { places, count } = this.props
    return (
      <Col lg={12}>
        <Header header={header} subHeader={count}/>
        <Filter />
        <PlacesTable places={places}/>
        <Pagination />
      </Col>
    )
  }
}

Places.propTypes = {
  places: PropTypes.array.isRequired,
  count: PropTypes.number,
  loadPlaces: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const {
    entities: { placesPage, place, territory },
    pagination: { placesActivePage }
  } = state
  const { count } = placesPage[ 1 ] || { count: null }
  const currentPage = placesPage[ placesActivePage ] || { results: [] }
  const placesOnPage = currentPage.results.map(id => place[ id ])
  const placesWithAte = placesOnPage.map(place => ({ ...place, ate: territory[ place.ate ] }))
  return ({
    places: placesWithAte,
    count
  })
}

export default connect(mapStateToProps, {
  loadPlaces
})(Places)
