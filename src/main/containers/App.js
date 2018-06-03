import React from 'react'
import ReduxToastr from 'react-redux-toastr'
import Helmet from 'react-helmet'
import { Grid } from 'react-bootstrap'

import { Disclaimer, Footer } from '../components'
import NavContainer from './NavContainer'
import ScrollToTop from './ScrollToTop'
import Routes from '../../routes'

export const App = () => (
  <div>
    <ReduxToastr
      preventDuplicates
      timeOut={4000}
      newestOnTop={false}
      position='top-right'
      transitionIn='fadeIn'
      transitionOut='fadeOut'/>
    <Helmet
      titleTemplate='%s | ГИА 2018 в Москве'
      defaultTitle='ГИА 2018 в Москве'
      meta={[ { 'name': 'description', 'content': 'ГИА 2018 в Москве' } ]}/>
    <NavContainer/>
    <ScrollToTop>
      <Grid fluid={true}>
        <Disclaimer/>
        <Routes/>
      </Grid>
    </ScrollToTop>
    <Footer/>
  </div>
)

export default App