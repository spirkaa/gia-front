import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Navigation } from '../components'
import { loadDataSources } from '../actions'
import { dataSourcesSelector } from '../selectors'

class NavContainer extends Component {
  componentDidMount () {
    this.props.loadDataSources()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !isEqual(nextProps, this.props)
  }

  render () {
    const { datasources } = this.props
    return (
      <Navigation datasources={datasources}/>
    )
  }
}

NavContainer.propTypes = {
  datasources: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  datasources: dataSourcesSelector(state)
})

export default connect(mapStateToProps, {
  loadDataSources
})(NavContainer)