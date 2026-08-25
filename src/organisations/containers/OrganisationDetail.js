import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Col } from "react-bootstrap"
import { Header } from "../../main/components"
import { loadOrgDetail } from "../actions"
import { organisationDetailSelector } from "../selectors"
import { EmpTable } from "../components"

const OrganisationDetail = () => {
  const dispatch = useDispatch()
  const { orgId } = useParams()
  const organisation = useSelector((state) =>
    organisationDetailSelector(state, { orgId }),
  )

  useEffect(() => {
    dispatch(loadOrgDetail(orgId))
  }, [dispatch, orgId])

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

export default OrganisationDetail
