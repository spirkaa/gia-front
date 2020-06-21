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
  DropdownButton,
  MenuItem,
} from "react-bootstrap"
import { loadDates, loadLevels } from "../actions"
import { datesSelector, levelsSelector } from "../selectors"

class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: this.props.filterVals.date ? this.props.filterVals.date : "",
      level: this.props.filterVals.level ? this.props.filterVals.level : "",
      search: this.props.filterVals.search ? this.props.filterVals.search : "",
    }
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSelectDate = this.handleSelectDate.bind(this)
    this.handleSelectLevel = this.handleSelectLevel.bind(this)
    this.handleClickSubmit = this.handleClickSubmit.bind(this)
    this.handleClickReset = this.handleClickReset.bind(this)
  }

  componentDidMount() {
    this.props.loadDates()
    this.props.loadLevels()
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

  handleSelectDate(date) {
    this.setState({
      date: new Date(date).toLocaleDateString("ru"),
    })
  }

  handleSelectLevel(level) {
    this.setState({
      level: level,
    })
  }

  handleClickSubmit() {
    this.props.onChange({
      date: this.state.date,
      level: this.state.level,
      search: this.state.search,
    })
  }

  handleClickReset() {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = ""),
    )
    this.setState({
      date: "",
      level: "",
      search: "",
    })
    this.props.onChange({
      date: "",
      level: "",
      search: "",
    })
  }

  render() {
    const { dates, levels } = this.props
    return (
      <Row className="bottom-buffer">
        <Col md={3} sm={3}></Col>
        <Col md={6} sm={6} className="text-center">
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup controlId="formInlineDate">
              <InputGroup>
                <DropdownButton
                  componentClass={InputGroup.Button}
                  id="date"
                  title={this.state.date}
                  aria-label="Дата экзамена">
                  {dates.map((date) => (
                    <MenuItem key={date} onSelect={() => this.handleSelectDate(date)}>
                      {new Date(date).toLocaleDateString("ru")}
                    </MenuItem>
                  ))}
                </DropdownButton>

                <DropdownButton
                  componentClass={InputGroup.Button}
                  id="level"
                  title={this.state.level}
                  aria-label="Уровень экзамена">
                  {levels.map((level) => (
                    <MenuItem
                      key={level}
                      onSelect={() => this.handleSelectLevel(level)}>
                      {level}
                    </MenuItem>
                  ))}
                </DropdownButton>

                <ControlLabel srOnly>Поиск</ControlLabel>
                <FormControl
                  autoFocus
                  type="text"
                  placeholder="Поиск..."
                  defaultValue={this.state.search}
                  onKeyUp={this.handleKeyUp}
                  onChange={this.handleChange}
                />

                <InputGroup.Button>
                  <Button
                    bsStyle="default"
                    disabled={
                      !this.state.search.length &&
                      !this.state.date.length &&
                      !this.state.level.length
                    }
                    onClick={this.handleClickReset}
                    aria-label="Очистить">
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
  dates: PropTypes.array.isRequired,
  levels: PropTypes.array.isRequired,
  loadDates: PropTypes.func.isRequired,
  loadLevels: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  dates: datesSelector(state),
  levels: levelsSelector(state),
})

export default connect(mapStateToProps, {
  loadDates,
  loadLevels,
})(Filter)
