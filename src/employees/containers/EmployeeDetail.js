import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Col } from 'react-bootstrap'
import { loadEmployeeDetail } from '../actions'
import { Header } from '../../main/components'
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

const mapStateToProps = (state, ownProps) => {
  const { employeeId } = ownProps.params
  const {
    entities: {
      employee, exam, date, level,
      position, organisation, place
    }
  } = state
  const employeeNorm = employee[ employeeId ] || { exams: [], org: null }
  if (employeeNorm.exams) {
    const examMap = employeeNorm.exams.map(id => exam[ id ])
    const examDetailed = examMap.map(ex => ({
      ...ex,
      date: date[ ex.date ].date,
      level: level[ ex.level ].level,
      position: position[ ex.position ].name,
      place: place[ ex.place ]
    }))
    const employeeDetailed = {
      ...employeeNorm,
      exams: examDetailed, org: organisation[ employeeNorm.org ]
    }
    return ({
      employee: employeeDetailed
    })
  }
  return ({
    employee: employeeNorm
  })
}

export default connect(mapStateToProps, { loadEmployeeDetail })(EmployeeDetail)