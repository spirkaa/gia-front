import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Grid } from 'react-bootstrap'
import { resetErrorMessage } from '../actions'
import { ErrorMsg, Footer } from '../components'
import NavContainer from './NavContainer'
import ScrollToTop from './ScrollToTop'
import Routes from '../../routes'

class App extends Component {
  renderErrorMessage () {
    const { errorMessage, resetErrorMessage } = this.props
    if (!errorMessage) {
      return null
    }
    return <ErrorMsg error={errorMessage} onDismiss={resetErrorMessage}/>
  }

  render () {
    return (
      <div>
        <Helmet
          titleTemplate='%s | ГИА 2017 в Москве'
          defaultTitle='ГИА 2017 в Москве'
          meta={[{'name': 'description', 'content': 'ГИА 2017 в Москве'}]}/>
        <NavContainer/>
        <ScrollToTop>
        <Grid fluid={true}>
          {this.renderErrorMessage()}
          <Routes/>
        </Grid>
        </ScrollToTop>
        <Footer/>
      </div>
    )
  }
}

App.propTypes = {
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired
}

const mapStateToProps = ({ errorMessage }) => ({ errorMessage })

export default connect(mapStateToProps, { resetErrorMessage })(App)