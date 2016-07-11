import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import { Header } from '../../main/components'
import { loadPlaces } from '../actions'
import { placesOnPageSelector, countSelector } from '../selectors'
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

const mapStateToProps = (state) => ({
  places: placesOnPageSelector(state),
  count: countSelector(state)
})

export default connect(mapStateToProps, {
  loadPlaces
})(Places)
