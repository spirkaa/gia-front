import React from 'react'
import { Link } from 'react-router'
import { Row, Col } from 'react-bootstrap'

export const NotFound = () => (
  <Row>
    <Col lg={12}>
      Страница не найдена. Вернуться на <Link to='/'>главную</Link>?
    </Col>
  </Row>
)

export default NotFound