import createDeepEqualSelector, {
  getEmpPage,
  getEmployee,
  getExam,
  getDate,
  getLevel,
  getPosition,
  getPlace,
  getOrganisation,
  getEmpFilter,
  getEmpActivePage
} from '../main/selectors'

const getCount = state => state.entities.empPage[ 1 ] || { count: null }
const getEmployeeDetail = (state, props) =>
  state.entities.employee[props.match.params.employeeId] || { exams: [], org: null }

export const empActivePageSelector = createDeepEqualSelector(
  getEmpActivePage,
  page => page
)

export const empFilterSelector = createDeepEqualSelector(
  getEmpFilter,
  filter => filter
)

const currentPageSelector = createDeepEqualSelector(
  getEmpPage,
  empActivePageSelector,
  (page, number) => page[number] || { results: [] }
)

export const countSelector = createDeepEqualSelector(
  getCount,
  page => page.count
)

export const employeesOnPageSelector = createDeepEqualSelector(
  currentPageSelector,
  getEmployee,
  getOrganisation,
  (page, employee, organisation) =>
    page.results
      .map(id => employee[ id ])
      .map(employee => ({ ...employee, org: organisation[ employee.org ] }))
)

export const examDetailSelector = createDeepEqualSelector(
  getEmployeeDetail,
  getExam,
  getDate,
  getLevel,
  getPosition,
  getPlace,
  (employee, exam, date, level, position, place) =>
    employee.exams
      ? employee.exams
      .map(id => exam[ id ])
      .map(ex => ({
        ...ex,
        date: date[ ex.date ].date,
        level: level[ ex.level ].level,
        position: position[ ex.position ].name,
        place: place[ ex.place ]
      }))
      : employee
)

export const employeeDetailSelector = createDeepEqualSelector(
  getEmployeeDetail,
  examDetailSelector,
  getOrganisation,
  (employee, exams, organisation) =>
    employee.exams
      ? ({ ...employee, exams, org: organisation[ employee.org ] })
      : employee
)
