import { ToastContainer } from "react-toastify"
import { Helmet } from "react-helmet-async"
import { Container } from "react-bootstrap"

import "react-toastify/dist/ReactToastify.css"

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
    <ToastContainer position="top-right" autoClose={4000} newestOnTop={false} />
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
      <Container fluid>
        <Disclaimer />
        <Routes />
      </Container>
    </ScrollToTop>
    <Footer />
  </div>
)

export default App
