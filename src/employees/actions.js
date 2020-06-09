import Schemas from "../middleware/schemas"
import { loadThis, actionTrigger, actionWithPayload } from "../main/actions"
import { EMP_FILTER_INITIAL_STATE } from "./reducer"

const EMPLOYEE_ENDPOINT = "employee"

export const EMPLOYEES_REQUEST = "EMPLOYEES_REQUEST"
export const EMPLOYEES_SUCCESS = "EMPLOYEES_SUCCESS"
export const EMPLOYEES_FAILURE = "EMPLOYEES_FAILURE"

export const EMPLOYEE_REQUEST = "EMPLOYEE_REQUEST"
export const EMPLOYEE_SUCCESS = "EMPLOYEE_SUCCESS"
export const EMPLOYEE_FAILURE = "EMPLOYEE_FAILURE"

export const EMPLOYEES_FILTER_SET = "EMPLOYEES_FILTER_SET"
export const EMPLOYEES_FILTER_CLEAR_PAGES = "EMPLOYEES_FILTER_CLEAR_PAGES"
export const EMPLOYEES_PAGE_SET = "EMPLOYEES_PAGE_SET"

export function loadEmployees(id = 1, filter = EMP_FILTER_INITIAL_STATE) {
  const { name, orgName } = filter
  return loadThis({
    id: id,
    source: "empPage",
    types: [EMPLOYEES_REQUEST, EMPLOYEES_SUCCESS, EMPLOYEES_FAILURE],
    schema: Schemas.EMP_PAGE,
    endpoint: `${EMPLOYEE_ENDPOINT}/?name=${name}&org_name=${orgName}&page=${id}`,
  })
}

export function loadEmployeeDetail(id) {
  return loadThis({
    id: id,
    source: EMPLOYEE_ENDPOINT,
    types: [EMPLOYEE_REQUEST, EMPLOYEE_SUCCESS, EMPLOYEE_FAILURE],
    schema: Schemas.EMP_DETAIL,
    endpoint: `${EMPLOYEE_ENDPOINT}/${id}/`,
    requiredFields: ["exams"],
  })
}

export const empFilterSet = (filter) => actionWithPayload(EMPLOYEES_FILTER_SET, filter)

export const empFilterClearPages = () => actionTrigger(EMPLOYEES_FILTER_CLEAR_PAGES)

export const empPageSet = (page) => actionWithPayload(EMPLOYEES_PAGE_SET, page)
