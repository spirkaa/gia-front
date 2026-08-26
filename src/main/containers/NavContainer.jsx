import isEqual from "lodash/isEqual"
import { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { Navigation } from "../components"
import { loadDataSources } from "../actions"
import { dataSourcesSelector } from "../selectors"
import { tokenSave } from "../../auth/actions"

class NavContainer extends Component {
  componentDidMount() {
    this.props.loadDataSources()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props)
  }

  componentDidUpdate() {
    if (this.props.rememberMe && this.props.token) {
      this.props.tokenSave(this.props.token)
    }
  }

  render() {
    const { datasources, isAuthenticated, email } = this.props
    return (
      <Navigation
        datasources={datasources}
        isAuthenticated={isAuthenticated}
        email={email}
      />
    )
  }
}

NavContainer.propTypes = {
  datasources: PropTypes.array.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  email: PropTypes.string,
  token: PropTypes.string,
  rememberMe: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  datasources: dataSourcesSelector(state),
  isAuthenticated: state.auth.isAuthenticated,
  email: state.auth.user.email,
  token: state.auth.token,
  rememberMe: state.auth.rememberMe,
})

export default connect(mapStateToProps, {
  loadDataSources,
  tokenSave,
})(NavContainer)
