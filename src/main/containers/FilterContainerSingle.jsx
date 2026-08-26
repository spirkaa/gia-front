import isEqual from "lodash/isEqual"
import { Component } from "react"
import PropTypes from "prop-types"
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap"

export default class FilterContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: this.props.filterVals.search ? this.props.filterVals.search : "",
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickSubmit = this.handleClickSubmit.bind(this)
    this.handleClickReset = this.handleClickReset.bind(this)
  }

  handleFilterChange(filterVals) {
    if (!isEqual(filterVals, this.props.filterVals)) {
      const { filterSet, loadFiltered, filterClearPages, pageSet } = this.props
      filterSet(filterVals)
      filterClearPages()
      loadFiltered(1, filterVals)
      pageSet(1)
    }
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleClickSubmit()
    }
  }

  handleChange(e) {
    this.setState({
      search: e.target.value,
    })
  }

  handleClickSubmit() {
    this.handleFilterChange({
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
    this.handleFilterChange({
      search: "",
    })
  }

  render() {
    return (
      <Row className="bottom-buffer">
        <Col md={3} sm={3}></Col>
        <Col md={6} sm={6} className="text-center">
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="formInlineSearch">
              <InputGroup>
                <Form.Label className="visually-hidden">Поиск</Form.Label>
                <Form.Control
                  autoFocus
                  autoComplete="off"
                  type="text"
                  placeholder="Поиск..."
                  defaultValue={this.state.search}
                  onKeyUp={this.handleKeyUp}
                  onChange={this.handleChange}
                />
                {!this.state.search.length ? (
                  ""
                ) : (
                  <Button
                    variant="secondary"
                    disabled={!this.state.search.length}
                    onClick={this.handleClickReset}
                    aria-label="Очистить">
                    {"✕"}
                  </Button>
                )}
                <Button variant="primary" onClick={this.handleClickSubmit}>
                  Найти
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </Col>
        <Col md={3} sm={3}></Col>
      </Row>
    )
  }
}

FilterContainer.propTypes = {
  Filter: PropTypes.any,
  filterVals: PropTypes.object.isRequired,
  loadFiltered: PropTypes.func.isRequired,
  filterSet: PropTypes.func.isRequired,
  filterClearPages: PropTypes.func.isRequired,
  pageSet: PropTypes.func.isRequired,
}
