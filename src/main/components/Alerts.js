import React, { PropTypes } from 'react'
import { Alert } from 'react-bootstrap'

export const ErrorMsg = ({ error, onDismiss }) => (
  <Alert bsStyle='danger' onDismiss={onDismiss}>
    <h4>Error</h4>
    <p>{error}</p>
  </Alert>
)

ErrorMsg.propTypes = {
  error: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired
}

export default ErrorMsg