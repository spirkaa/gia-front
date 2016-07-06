import isEqual from 'lodash/isEqual'
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
    if (!isEqual(nextProps.empFilter, this.props.empFilter)) {
      findDOMNode(this.refs.name).value = nextProps.empFilter.name
      findDOMNode(this.refs.org).value = nextProps.empFilter.orgName
    }
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.onChange({
      name: findDOMNode(this.refs.name).value,
      orgName: findDOMNode(this.refs.org).value
    })
  }

  render () {
    const { empFilter } = this.props
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline>
            <FormGroup controlId='formInlineName'>
              <FormControl
                type='text'
                placeholder='ФИО сотрудника'
                ref='name'
                defaultValue={empFilter.name}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineOrg'>
              <FormControl
                type='text'
                placeholder='Место работы'
                ref='org'
                defaultValue={empFilter.orgName}
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
  empFilter: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Filter