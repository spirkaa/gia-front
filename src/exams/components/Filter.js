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
    if (nextProps.examFilter !== this.props.examFilter) {
      findDOMNode(this.refs.empName).value = nextProps.examFilter.empName
      findDOMNode(this.refs.empOrgName).value = nextProps.examFilter.empOrgName
    }
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
    const { examFilter, dateList, levelList } = this.props
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline>
            <FormGroup controlId='formInlineDate'>
              <FormControl
                componentClass='select'
                placeholder='Дата'
                ref='date'
                defaultValue={examFilter.date}
                onKeyUp={this.handleKeyUp}>
                {<option></option>}
                {dateList.map(date => (<option key={date}>{new Date(date).toLocaleDateString('ru')}</option>))}
              </FormControl>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineLevel'>
              <FormControl
                componentClass='select'
                placeholder='Уровень'
                ref='level'
                defaultValue={examFilter.level}
                onKeyUp={this.handleKeyUp}>
                {<option></option>}
                {levelList.map(level => (<option key={level}>{level}</option>))}
              </FormControl>
            </FormGroup>{' '}
            <FormGroup controlId='formInlinePlaceCode'>
              <FormControl
                type='text'
                placeholder='Код ППЭ'
                ref='placeCode'
                defaultValue={examFilter.placeCode}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlinePlaceName'>
              <FormControl
                type='text'
                placeholder='Наименование ППЭ'
                ref='placeName'
                defaultValue={examFilter.placeName}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlinePlaceAddr'>
              <FormControl
                type='text'
                placeholder='Адрес ППЭ'
                ref='placeAddr'
                defaultValue={examFilter.placeAddr}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineEmpName'>
              <FormControl
                type='text'
                placeholder='ФИО сотрудника'
                ref='empName'
                defaultValue={examFilter.empName}
                onKeyUp={this.handleKeyUp}/>
            </FormGroup>{' '}
            <FormGroup controlId='formInlineEmpOrgName'>
              <FormControl
                type='text'
                placeholder='Место работы'
                ref='empOrgName'
                defaultValue={examFilter.empOrgName}
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
  examFilter: PropTypes.object.isRequired,
  dateList: PropTypes.array.isRequired,
  levelList: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Filter