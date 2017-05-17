import isEqual from 'lodash/isEqual'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { Row, Col, Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap'
import { loadEmployees, empFilterSet, empFilterClearPages, empPageSet } from '../actions'
import { empFilterSelector } from '../selectors'
import FilterContainer from '../../main/containers/FilterContainer'

class Filter extends Component {
  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.filterVals, this.props.filterVals)) {
      findDOMNode(this.refs.name).value = nextProps.filterVals.name
      findDOMNode(this.refs.org).value = nextProps.filterVals.orgName
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
    const { filterVals } = this.props
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline>
            <FormGroup controlId='formInlineName'>
              <ControlLabel srOnly>ФИО сотрудника</ControlLabel>
              <FormControl
                type='text'
                placeholder='ФИО сотрудника'
                ref='name'
                defaultValue={filterVals.name}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineOrg'>
              <ControlLabel srOnly>Место работы</ControlLabel>
              <FormControl
                type='text'
                placeholder='Место работы'
                ref='org'
                defaultValue={filterVals.orgName}
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
  filterVals: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  Filter: Filter,
  filterVals: empFilterSelector(state)
})

export default connect(mapStateToProps, {
  loadFiltered: loadEmployees,
  filterSet: empFilterSet,
  filterClearPages: empFilterClearPages,
  pageSet: empPageSet
})(FilterContainer)