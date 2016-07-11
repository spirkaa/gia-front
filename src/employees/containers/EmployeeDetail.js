import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Col } from 'react-bootstrap'
import { Header } from '../../main/components'
import { loadEmployeeDetail } from '../actions'
import { employeeDetailSelector } from '../selectors'
import { ExamTable } from '../components'

class EmployeeDetail extends Component {
  componentDidMount () {
    const { employeeId } = this.props.params
    this.props.loadEmployeeDetail(employeeId)
  }

  render () {
    const { employee } = this.props
    if (employee.name && employee.exams) {
      const org = <Link to={`/organisations/detail/${employee.org.id}`}>{employee.org.name}</Link>
      return (
        <Col lg={12}>
          <Header header={employee.name} subHeader={org}/>
          <ExamTable exams={employee.exams}/>
        </Col>
      )
    }
    return (
      <Col lg={12} className='text-center'>
        Loading...
      </Col>
    )
  }
}

EmployeeDetail.propTypes = {
  employee: PropTypes.object.isRequired,
  loadEmployeeDetail: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  employee: employeeDetailSelector(state, ownProps)
})

export default connect(mapStateToProps, { loadEmployeeDetail })(EmployeeDetail)