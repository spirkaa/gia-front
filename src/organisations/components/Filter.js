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
    if (nextProps.nameVal !== this.props.nameVal) {
      findDOMNode(this.refs.name).value = nextProps.nameVal
    }
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.onChange({
      nameVal: findDOMNode(this.refs.name).value
    })
  }

  render () {
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline onSubmit={ (e) => e.preventDefault() }>
            <FormGroup controlId='formInlineName'>
              <FormControl
                type='text'
                placeholder='Название ОО'
                ref='name'
                defaultValue={this.props.nameVal}
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
  onChange: PropTypes.func.isRequired
}

export default Filter