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
    if (nextProps.orgFilter !== this.props.orgFilter) {
      findDOMNode(this.refs.name).value = nextProps.orgFilter.name
    }
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.onChange({
      name: findDOMNode(this.refs.name).value
    })
  }

  render () {
    const { orgFilter } = this.props
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline onSubmit={ (e) => e.preventDefault() }>
            <FormGroup controlId='formInlineName'>
              <FormControl
                type='text'
                placeholder='Название ОО'
                ref='name'
                defaultValue={orgFilter.name}
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
  orgFilter: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Filter