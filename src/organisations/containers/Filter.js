import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { Row, Col, Form, FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap'
import { loadOrganisations, orgFilterSet, orgFilterClearPages, orgPageSet } from '../actions'
import { orgFilterSelector } from '../selectors'
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
    const { filterVals } = this.props
    return (
      <Row className='bottom-buffer'>
        <Col lg={12} className='text-center'>
          <Form inline onSubmit={ (e) => e.preventDefault() }>
            <FormGroup controlId='formInlineName'>
              <ControlLabel srOnly>Наименование ОО</ControlLabel>
              <FormControl
                type='text'
                placeholder='Наименование ОО'
                ref='name'
                defaultValue={filterVals.name}
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
  filterVals: orgFilterSelector(state)
})

export default connect(mapStateToProps, {
  loadFiltered: loadOrganisations,
  filterSet: orgFilterSet,
  filterClearPages: orgFilterClearPages,
  pageSet: orgPageSet
})(FilterContainer)