import isEqual from "lodash/isEqual"
import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { toastr } from "react-redux-toastr"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { subsAdd } from "../../subscriptions/actions"
import { loadEmployeeDetail } from "../actions"
import { employeeDetailSelector } from "../selectors"
import { ExamTable } from "../components"

class EmployeeDetail extends Component {
  componentDidMount() {
    console.log(this)
    const { employeeId } = this.props.params
    this.props.loadEmployeeDetail(employeeId)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isSubAddRequested) {
      this.props.navigate("/subscriptions")
    }
    if (!isEqual(nextProps.subsMsg, this.props.subsMsg)) {
      const message = nextProps.subsMsg
      if (message.non_field_errors) {
        message.non_field_errors.map((msg) => toastr.error("Ошибка", msg))
      }
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    if (this.props.token) {
      this.props.subsAdd(this.props.token, this.props.employeeId)
    } else {
      this.props.navigate("/registration")
    }
  }

  render() {
    const { employee, isSubAddRequesting } = this.props
    if (employee.name && employee.exams) {
      const org = (
        <Link to={`/organisations/detail/${employee.org.id}`}>{employee.org.name}</Link>
      )
      return (
        <div>
          <Header header={employee.name} subHeader={org} />
          <Row>
            <Col sm={4}></Col>
            <Col sm={4} className="bottom-buffer">
              <Form onSubmit={this.handleSubmit}>
                <Button
                  block
                  type="submit"
                  bsStyle="primary"
                  disabled={isSubAddRequesting}>
                  {isSubAddRequesting
                    ? "Пожалуйста, подождите..."
                    : "Подписаться на обновления"}
                </Button>
              </Form>
            </Col>
            <Col sm={4}></Col>
          </Row>
          <Row>
            <Col lg={1}></Col>
            <Col lg={10}>
              <ExamTable exams={employee.exams} />
            </Col>
            <Col lg={1}></Col>
          </Row>
        </div>
      )
    }
    return (
      <Row>
        <Col lg={12} className="text-center">
          Loading...
        </Col>
      </Row>
    )
  }
}

EmployeeDetail.propTypes = {
  employee: PropTypes.object.isRequired,
  loadEmployeeDetail: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  employee: employeeDetailSelector(state, ownProps),
  token: state.auth.token,
  subsMsg: state.subs.subsMsg,
  isSubAddRequesting: state.subs.isSubAddRequesting,
  isSubAddRequested: state.subs.isSubAddRequested,
})

export default connect(mapStateToProps, {
  loadEmployeeDetail,
  subsAdd,
})(EmployeeDetail)
