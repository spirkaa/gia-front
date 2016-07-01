import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { Row, Col, Form, FormGroup, FormControl, Button, Glyphicon } from 'react-bootstrap'

export class Filter extends Component {
  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.nameVal !== this.props.nameVal || nextProps.orgNameVal !== this.props.orgNameVal) {
      findDOMNode(this.refs.name).value = nextProps.nameVal
      findDOMNode(this.refs.org).value = nextProps.orgNameVal
    }
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.onChange({
      nameVal: findDOMNode(this.refs.name).value,
      orgNameVal: findDOMNode(this.refs.org).value
    })
  }

  render () {
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline>
            <FormGroup controlId='formInlineName'>
              <FormControl
                type='text'
                placeholder='ФИО сотрудника'
                ref='name'
                defaultValue={this.props.nameVal}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineOrg'>
              <FormControl
                type='text'
                placeholder='Место работы'
                ref='org'
                defaultValue={this.props.orgNameVal}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <Button bsStyle='primary' onClick={this.handleButtonClick}>
              <Glyphicon glyph='search' />
            </Button>
          </Form>
        </Col>
      </Row>
    )
  }
}

Filter.propTypes = {
  nameVal: PropTypes.string.isRequired,
  orgNameVal: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Filter