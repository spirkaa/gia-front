import React, { Component } from 'react' // eslint-disable-line
import { connect } from 'react-redux'

import { userLogout } from '../actions'

class Logout extends Component {
  componentWillMount () {
    if (this.props.isAuthenticated) {
      this.props.userLogout()
    }
    this.props.history.push('/')
  }

  render () {
    return (
      null
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {
  userLogout
})(Logout)