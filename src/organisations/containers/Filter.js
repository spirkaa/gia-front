import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  Glyphicon,
  InputGroup,
} from "react-bootstrap"
import {
  loadOrganisations,
  orgFilterSet,
  orgFilterClearPages,
  orgPageSet,
} from "../actions"
import { orgFilterSelector } from "../selectors"
import FilterContainer from "../../main/containers/FilterContainer"

class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: "",
    }
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickSubmit = this.handleClickSubmit.bind(this)
    this.handleClickReset = this.handleClickReset.bind(this)
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleButtonClick()
    }
  }

  handleChange(e) {
    this.setState({
      search: e.target.value,
    })
  }

  handleClickSubmit() {
    this.props.onChange({
      search: this.state.search,
    })
  }

  handleClickReset() {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = ""),
    )
    this.setState({
      search: "",
    })
    this.props.onChange({
      search: "",
    })
  }

  render() {
    return (
      <Row className="bottom-buffer">
        <Col md={3} sm={3}></Col>
        <Col md={6} sm={6} className="text-center">
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup controlId="formInlineSearch">
              <InputGroup>
                <ControlLabel srOnly>Поиск</ControlLabel>
                <FormControl
                  autoFocus
                  type="text"
                  placeholder="Поиск..."
                  ref="search"
                  defaultValue={this.state.search}
                  onKeyUp={this.handleKeyUp}
                  onChange={this.handleChange}
                />
                <InputGroup.Button>
                  <Button
                    bsStyle="default"
                    disabled={!this.state.search.length}
                    onClick={this.handleClickReset}>
                    <Glyphicon glyph="remove" />
                  </Button>
                </InputGroup.Button>
                <InputGroup.Button>
                  <Button bsStyle="primary" onClick={this.handleClickSubmit}>
                    Найти
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </Form>
        </Col>
        <Col md={3} sm={3}></Col>
      </Row>
    )
  }
}

Filter.propTypes = {
  filterVals: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  Filter: Filter,
  filterVals: orgFilterSelector(state),
})

export default connect(mapStateToProps, {
  loadFiltered: loadOrganisations,
  filterSet: orgFilterSet,
  filterClearPages: orgFilterClearPages,
  pageSet: orgPageSet,
})(FilterContainer)
