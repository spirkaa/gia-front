import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { PageHeader, Row } from "react-bootstrap"

export const Header = ({ header, subHeader }) => (
  <Row>
    <PageHeader className="text-center">
      <Helmet title={header} />
      {header}
      <br />
      <small>{!subHeader ? "..." : subHeader}</small>
    </PageHeader>
  </Row>
)

Header.propTypes = {
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subHeader: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]),
}

export default Header
