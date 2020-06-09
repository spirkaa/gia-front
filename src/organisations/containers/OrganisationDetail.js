import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Col } from "react-bootstrap"
import { Header } from "../../main/components"
import { loadOrgDetail } from "../actions"
import { organisationDetailSelector } from "../selectors"
import { EmpTable } from "../components"

class OrganisationDetail extends Component {
  componentDidMount() {
    const { orgId } = this.props.match.params
    this.props.loadOrgDetail(orgId)
  }

  render() {
    const { organisation } = this.props
    if (organisation.name && organisation.employees) {
      const subHeader = "Работники ППЭ от организации"
      return (
        <Col lg={12}>
          <Header header={organisation.name} subHeader={subHeader} />
          <EmpTable employees={organisation.employees} />
        </Col>
      )
    }
    return (
      <Col lg={12} className="text-center">
        Loading...
      </Col>
    )
  }
}

OrganisationDetail.propTypes = {
  organisation: PropTypes.object.isRequired,
  loadOrgDetail: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  organisation: organisationDetailSelector(state, ownProps),
})

export default connect(mapStateToProps, { loadOrgDetail })(OrganisationDetail)
