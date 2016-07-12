import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { Row, Col, Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap'
import { loadDates, loadLevels } from '../actions'
import { datesSelector, levelsSelector } from '../selectors'

class Filter extends Component {
  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  componentDidMount () {
    this.props.loadDates()
    this.props.loadLevels()
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.filterVals, this.props.filterVals)) {
      findDOMNode(this.refs.date).value = nextProps.filterVals.date
      findDOMNode(this.refs.level).value = nextProps.filterVals.level
      findDOMNode(this.refs.placeCode).value = nextProps.filterVals.placeCode
      findDOMNode(this.refs.placeName).value = nextProps.filterVals.placeName
      findDOMNode(this.refs.placeAddr).value = nextProps.filterVals.placeAddr
      findDOMNode(this.refs.empName).value = nextProps.filterVals.empName
      findDOMNode(this.refs.empOrgName).value = nextProps.filterVals.empOrgName
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !isEqual(nextProps, this.props)
  }

  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleButtonClick () {
    this.props.onChange({
      date: findDOMNode(this.refs.date).value,
      level: findDOMNode(this.refs.level).value,
      placeCode: findDOMNode(this.refs.placeCode).value,
      placeName: findDOMNode(this.refs.placeName).value,
      placeAddr: findDOMNode(this.refs.placeAddr).value,
      empName: findDOMNode(this.refs.empName).value,
      empOrgName: findDOMNode(this.refs.empOrgName).value
    })
  }

  render () {
    const { filterVals, dates, levels } = this.props
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline>
            <FormGroup controlId='formInlineDate'>
              <ControlLabel srOnly>Дата</ControlLabel>
              <FormControl
                componentClass='select'
                placeholder='Дата'
                ref='date'
                defaultValue={filterVals.date}
                onKeyUp={this.handleKeyUp}>
                {<option></option>}
                {dates.map(date => (<option key={date}>{new Date(date).toLocaleDateString('ru')}</option>))}
              </FormControl>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineLevel'>
              <ControlLabel srOnly>Уровень</ControlLabel>
              <FormControl
                componentClass='select'
                placeholder='Уровень'
                ref='level'
                defaultValue={filterVals.level}
                onKeyUp={this.handleKeyUp}>
                {<option></option>}
                {levels.map(level => (<option key={level}>{level}</option>))}
              </FormControl>
            </FormGroup>{' '}
            <FormGroup controlId='formInlinePlaceCode'>
              <ControlLabel srOnly>Код ППЭ</ControlLabel>
              <FormControl
                type='text'
                placeholder='Код ППЭ'
                ref='placeCode'
                defaultValue={filterVals.placeCode}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlinePlaceName'>
              <ControlLabel srOnly>Наименование ППЭ</ControlLabel>
              <FormControl
                type='text'
                placeholder='Наименование ППЭ'
                ref='placeName'
                defaultValue={filterVals.placeName}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlinePlaceAddr'>
              <ControlLabel srOnly>Адрес ППЭ</ControlLabel>
              <FormControl
                type='text'
                placeholder='Адрес ППЭ'
                ref='placeAddr'
                defaultValue={filterVals.placeAddr}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineEmpName'>
              <ControlLabel srOnly>ФИО сотрудника</ControlLabel>
              <FormControl
                type='text'
                placeholder='ФИО сотрудника'
                ref='empName'
                defaultValue={filterVals.empName}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineEmpOrgName'>
              <ControlLabel srOnly>Место работы</ControlLabel>
              <FormControl
                type='text'
                placeholder='Место работы'
                ref='empOrgName'
                defaultValue={filterVals.empOrgName}
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
  onChange: PropTypes.func.isRequired,
  dates: PropTypes.array.isRequired,
  levels: PropTypes.array.isRequired,
  loadDates: PropTypes.func.isRequired,
  loadLevels: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  dates: datesSelector(state),
  levels: levelsSelector(state)
})

export default connect(mapStateToProps, {
  loadDates,
  loadLevels
})(Filter)