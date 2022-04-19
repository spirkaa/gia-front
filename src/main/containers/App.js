import React from "react"
import ReduxToastr from "react-redux-toastr"
import Helmet from "react-helmet"
import { Grid } from "react-bootstrap"

import { Disclaimer, Footer } from "../components"
import NavContainer from "./NavContainer"
import ScrollToTop from "./ScrollToTop"
import Routes from "../../routes"

const titleWithYear = () => {
  return "ГИА " + new Date().getFullYear() + " в Москве"
}

const metaDescription =
  "Список организаторов ППЭ Москвы, " +
  "задействованных при проведении ЕГЭ и ОГЭ. " +
  "Удобный поиск информации о распределении сотрудников " +
  "образовательных организаций в ППЭ (пункты проведения экзаменов). ГИА в Москве"

export const App = () => (
  <div>
    <ReduxToastr
      preventDuplicates
      timeOut={4000}
      newestOnTop={false}
      position="top-right"
      transitionIn="fadeIn"
      transitionOut="fadeOut"
    />
    <Helmet
      titleTemplate={"%s | " + titleWithYear()}
      defaultTitle={titleWithYear()}
      meta={[
        {
          name: "description",
          content: metaDescription,
        },
      ]}
    />
    <NavContainer />
    <ScrollToTop>
      <Grid fluid={true}>
        <Disclaimer />
        <Routes />
      </Grid>
    </ScrollToTop>
    <Footer />
  </div>
)

export default App
