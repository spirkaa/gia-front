import React, { PropTypes } from 'react'
import { PageHeader } from 'react-bootstrap'

export const Header = ({ header, subHeader }) => (
  <PageHeader className='text-center'>
    {header}<br />
    <small>{!subHeader ? '...' : subHeader}</small>
  </PageHeader>
)

Header.propTypes = {
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number ]),
  subHeader: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element])
}

export default Header