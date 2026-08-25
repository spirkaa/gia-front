import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet-async"
import { Row } from "react-bootstrap"

export const Header = ({ header, subHeader }) => (
  <Row>
    <div className="page-header text-center border-bottom pb-2">
      <Helmet title={header} />
      <h1>
        {header}
        <br />
        <small className="text-muted">{!subHeader ? "..." : subHeader}</small>
      </h1>
    </div>
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
