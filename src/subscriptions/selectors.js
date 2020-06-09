import createDeepEqualSelector, {
  getDate,
  getEmployee,
  getExam,
  getLevel,
  getOrganisation,
  getPlace,
  getPosition,
} from "../main/selectors"

export const getSubsPage = (state) => state.entities.subsPage
export const getSubs = (state) => state.entities.subscription
export const getSubsActivePage = (state) => state.pagination.subsActivePage

const getCount = (state) => state.entities.subsPage[1] || { count: 0 }

export const subsActivePageSelector = createDeepEqualSelector(
  getSubsActivePage,
  (page) => page,
)

const currentPageSelector = createDeepEqualSelector(
  getSubsPage,
  subsActivePageSelector,
  (page, number) => page[number] || { results: [] },
)

export const countSelector = createDeepEqualSelector(getCount, (page) => page.count)

export const subsOnPageSelector = createDeepEqualSelector(
  currentPageSelector,
  getSubs,
  getEmployee,
  getOrganisation,
  (page, subscription, employee, organisation) =>
    page.results
      .map((id) => subscription[id])
      .map((subscription) => ({
        ...subscription,
        employee: {
          ...employee[subscription.employee],
          org: organisation[employee[subscription.employee].org],
        },
      })),
)

export const subsWithExamsSelector = createDeepEqualSelector(
  subsOnPageSelector,
  getExam,
  getDate,
  getLevel,
  getPosition,
  getPlace,
  (subs, exam, date, level, position, place) =>
    subs.map((s) => ({
      ...s,
      employee: {
        ...s.employee,
        exams: s.employee.exams
          .map((id) => exam[id])
          .map((ex) => ({
            ...ex,
            date: date[ex.date].date,
            level: level[ex.level].level,
            position: position[ex.position].name,
            place: place[ex.place],
          })),
      },
    })),
)
