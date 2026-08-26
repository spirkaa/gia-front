import isEqual from "lodash/isEqual"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Button, Col, Form, Row } from "react-bootstrap"

import { Header } from "../../main/components"
import { subsAdd } from "../../subscriptions/actions"
import { loadEmployeeDetail } from "../actions"
import { employeeDetailSelector } from "../selectors"
import { ExamTable } from "../components"

const EmployeeDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { employeeId } = useParams()

  const employee = useSelector((state) => employeeDetailSelector(state, { employeeId }))
  const token = useSelector((state) => state.auth.token)
  const subsMsg = useSelector((state) => state.subs.subsMsg)
  const isSubAddRequesting = useSelector((state) => state.subs.isSubAddRequesting)
  const isSubAddRequested = useSelector((state) => state.subs.isSubAddRequested)

  useEffect(() => {
    dispatch(loadEmployeeDetail(employeeId))
  }, [dispatch, employeeId])

  const prevSubsMsg = useRef(subsMsg)
  useEffect(() => {
    if (isSubAddRequested) {
      navigate("/subscriptions")
    }
    if (!isEqual(subsMsg, prevSubsMsg.current)) {
      const message = subsMsg
      if (message.non_field_errors) {
        message.non_field_errors.map((msg) => toast.error(msg, { title: "Ошибка" }))
      }
      prevSubsMsg.current = subsMsg
    }
  }, [subsMsg, isSubAddRequested, navigate])

  const handleSubmit = (evt) => {
    evt.preventDefault()
    if (token) {
      dispatch(subsAdd(token, employeeId))
    } else {
      navigate("/registration")
    }
  }

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
            <Form onSubmit={handleSubmit}>
              <Button
                className="w-100"
                type="submit"
                variant="primary"
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

export default EmployeeDetail
