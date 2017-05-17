import createDeepEqualSelector, {
  getOrgPage,
  getEmployee,
  getOrganisation,
  getOrgFilter,
  getOrgActivePage
} from '../main/selectors'

const getCount = state => state.entities.orgPage[ 1 ] || { count: null }
const getOrganisationDetail = (state, props) =>
  state.entities.organisation[props.match.params.orgId] || { employees: [] }

export const orgActivePageSelector = createDeepEqualSelector(
  getOrgActivePage,
  page => page
)

export const orgFilterSelector = createDeepEqualSelector(
  getOrgFilter,
  filter => filter
)

const currentPageSelector = createDeepEqualSelector(
  getOrgPage,
  orgActivePageSelector,
  (page, number) => page[number] || { results: [] }
)

export const countSelector = createDeepEqualSelector(
  getCount,
  page => page.count
)

export const organisationsOnPageSelector = createDeepEqualSelector(
  currentPageSelector,
  getOrganisation,
  (page, organisation) => page.results.map(id => organisation[ id ])
)

export const organisationDetailSelector = createDeepEqualSelector(
  getOrganisationDetail,
  getEmployee,
  (org, employee) =>
    org.employees
      ? ({...org, employees: org.employees.map(id => employee[ id ])})
      : org
)
