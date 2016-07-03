import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Col } from 'react-bootstrap'
import { loadOrgDetail } from '../actions'
import { Header } from '../../main/components'
import { EmpTable } from '../components'

class OrganisationDetail extends Component {
  componentDidMount () {
    const { orgId } = this.props.params
    this.props.loadOrgDetail(orgId, [ 'employees' ])
  }

  render () {
    const { organisation } = this.props
    if (organisation.name && organisation.employees) {
      const subHeader = 'Работники ППЭ от организации'
      return (
        <Col lg={12}>
          <Header header={organisation.name} subHeader={subHeader}/>
          <EmpTable employees={organisation.employees}/>
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

OrganisationDetail.propTypes = {
  organisation: PropTypes.object.isRequired,
  loadOrgDetail: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { orgId } = ownProps.params
  const {
    entities: {
      employee, organisation
    }
  } = state
  const organisationNorm = organisation[ orgId ] || { employees: [] }
  if (organisationNorm.employees) {
    const employeeMap = organisationNorm.employees.map(id => employee[ id ])
    const organisationDetailed = {
      ...organisationNorm,
      employees: employeeMap
    }
    return ({
      organisation: organisationDetailed
    })
  }
  return ({
    organisation: organisationNorm
  })
}

export default connect(mapStateToProps, { loadOrgDetail })(OrganisationDetail)