import React from 'react'
import { Col, Alert } from 'react-bootstrap'

const ErrorMsg = ({error}) => (
  <Col lg={12}>
    <Alert bsStyle='danger'>Error: {error}</Alert>
  </Col>
)

export default ErrorMsg