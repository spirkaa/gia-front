import React from 'react'
import { Row, Col, Form, FormGroup, FormControl, Button } from 'react-bootstrap'

const Filter = () => (
  <Row className='bottom-buffer'>
    <Col lg={12} className='text-center'>
      <Form inline>
        <FormGroup controlId='formInlineName'>
          <FormControl type='text' placeholder='ФИО сотрудника'/>
        </FormGroup>{' '}
        <FormGroup controlId='formInlineOrg'>
          <FormControl type='text' placeholder='Место работы'/>
        </FormGroup>{' '}
        <Button bsStyle='primary' type='submit'>
          Найти
        </Button>
      </Form>
    </Col>
  </Row>
)

export default Filter