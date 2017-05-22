import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Col } from 'react-bootstrap'
import { Header } from '../../main/components'
import { loadPlaces } from '../actions'
import { placesOnPageSelector, countSelector } from '../selectors'
import { PlacesTable } from '../components'
import Filter from './Filter'
import Pagination from './Pagination'

class Places extends Component {
  componentDidMount () {
    const { placesPageNum } = this.props.match.params
    placesPageNum
      ? this.props.loadPlaces(placesPageNum)
      : this.props.loadPlaces()
  }

  render () {
    const header = 'Пункты проведения экзамена'
    const { places, count } = this.props
    let { placesPageNum } = this.props.match.params
    placesPageNum
      ? placesPageNum = parseInt(placesPageNum, 10)
      : placesPageNum = 1
    return (
      <Col lg={12}>
        <Header header={header} subHeader={count}/>
        <ul>
          <Link to='/places/3'>/places/3</Link>
          <li>/places/4</li>
          <li>/places/5</li>
        </ul>
        <Filter />
        <PlacesTable places={places}/>
        <Pagination navPageNum={placesPageNum}/>
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
