import React, { Component } from 'react' // eslint-disable-line
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'

import { userLogout } from '../actions'

class Logout extends Component {
  componentWillMount () {
    if (this.props.isAuthenticated) {
      this.props.userLogout()
      toastr.success('Выход выполнен', 'Сессия завершена')
    }
    this.props.history.push('/')
  }

  render () {
    return (
      null
    )
  }
}

Logout.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {
  userLogout
})(Logout)