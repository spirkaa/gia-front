import React from 'react'
import { Col, Row } from 'react-bootstrap'

import { Header } from '../../main/components'

export const PasswordEmailSent = () => {
  const header = 'Восстановление пароля'
  const subheader = 'Еще один шаг'
  return (
    <Row className='bottom-buffer'>
      <Header header={header} subHeader={subheader}/>
      <Col sm={4}>{''}</Col>
      <Col sm={4}>
        <p>
          Письмо для восстановления пароля отправлено на указанный адрес.
          Перейдите по ссылке из письма и введите новый пароль.
        </p>
      </Col>
      <Col sm={4}>{''}</Col>
    </Row>
  )
}

export default PasswordEmailSent