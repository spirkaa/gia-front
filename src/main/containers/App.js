import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Grid } from 'react-bootstrap'
import { resetErrorMessage } from '../actions'
import { ErrorMsg, Navigation, Footer } from '../components'

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
          titleTemplate='%s | ГИА 2016 в Москве'
          defaultTitle='ГИА 2016 в Москве'
          meta={[{'name': 'description', 'content': 'ГИА 2016 в Москве'}]}/>
        <Navigation/>
        <Grid fluid={true}>
          {this.renderErrorMessage()}
          {this.props.children}
        </Grid>
        <Footer/>
      </div>
    )
  }
}

App.propTypes = {
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  children: PropTypes.node
}

const mapStateToProps = ({ errorMessage }) => ({ errorMessage })

export default connect(mapStateToProps, { resetErrorMessage })(App)