import React from 'react'
import { PageHeader } from 'react-bootstrap'

const Header = ({ header, subHeader }) => (
  <PageHeader className='text-center'>
    {header}<br />
    <small>{subHeader}</small>
  </PageHeader>
)

export default Header