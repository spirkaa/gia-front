import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { Row, Col, Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap'
import FilterContainer from '../../main/containers/FilterContainer'
import { loadPlaces, placesFilterSet, placesFilterClearPages, placesPageSet } from '../actions'
import { placesFilterSelector } from '../selectors'

class Filter extends Component {
  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.filterVals, this.props.filterVals)) {
      findDOMNode(this.refs.code).value = nextProps.filterVals.code
      findDOMNode(this.refs.name).value = nextProps.filterVals.name
      findDOMNode(this.refs.addr).value = nextProps.filterVals.addr
      findDOMNode(this.refs.ateCode).value = nextProps.filterVals.ateCode
      findDOMNode(this.refs.ateName).value = nextProps.filterVals.ateName
    }
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.onChange({
      code: findDOMNode(this.refs.code).value,
      name: findDOMNode(this.refs.name).value,
      addr: findDOMNode(this.refs.addr).value,
      ateCode: findDOMNode(this.refs.ateCode).value,
      ateName: findDOMNode(this.refs.ateName).value
    })
  }

  render () {
    const { filterVals } = this.props
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline onSubmit={ (e) => e.preventDefault() }>
            <FormGroup controlId='formInlineCode'>
              <ControlLabel srOnly>Название ОО</ControlLabel>
              <FormControl
                type='text'
                placeholder='Код ППЭ'
                ref='code'
                defaultValue={filterVals.code}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineName'>
              <ControlLabel srOnly>Наименование ППЭ</ControlLabel>
              <FormControl
                type='text'
                placeholder='Наименование ППЭ'
                ref='name'
                defaultValue={filterVals.name}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineAddr'>
              <ControlLabel srOnly>Адрес ППЭ</ControlLabel>
              <FormControl
                type='text'
                placeholder='Адрес ППЭ'
                ref='addr'
                defaultValue={filterVals.addr}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineAteCode'>
              <ControlLabel srOnly>Код АТЕ</ControlLabel>
              <FormControl
                type='text'
                placeholder='Код АТЕ'
                ref='ateCode'
                defaultValue={filterVals.ateCode}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
             <FormGroup controlId='formInlineAteName'>
               <ControlLabel srOnly>Наименование АТЕ</ControlLabel>
              <FormControl
                type='text'
                placeholder='Наименование АТЕ'
                ref='ateName'
                defaultValue={filterVals.ateName}
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
  filterVals: placesFilterSelector(state)
})

export default connect(mapStateToProps, {
  loadFiltered: loadPlaces,
  filterSet: placesFilterSet,
  filterClearPages: placesFilterClearPages,
  pageSet: placesPageSet
})(FilterContainer)