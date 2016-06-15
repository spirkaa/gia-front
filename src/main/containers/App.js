import React, { Component } from 'react'
import { Grid } from 'react-bootstrap'
import Navigation from '../components/Navigation'

export default class App extends Component {
  render () {
    return (
      <div>
        <Navigation />
        <Grid fluid={true}>
          {this.props.children}
        </Grid>
      </div>
    )
  }
}