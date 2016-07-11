import createDeepEqualSelector, {
  getDatePage,
  getLevelPage,
  getExamPage,
  getEmployee,
  getExam,
  getDate,
  getLevel,
  getPosition,
  getPlace,
  getOrganisation,
  getExamFilter,
  getExamActivePage
} from '../main/selectors'

const getCount = state => state.entities.examPage[ 1 ] || { count: null }

export const examActivePageSelector = createDeepEqualSelector(
  getExamActivePage,
  page => page
)

export const examFilterSelector = createDeepEqualSelector(
  getExamFilter,
  filter => filter
)

const currentPageSelector = createDeepEqualSelector(
  getExamPage,
  examActivePageSelector,
  (page, number) => page[number] || { results: [] }
)

export const countSelector = createDeepEqualSelector(
  getCount,
  page => page.count
)

export const examsOnPageSelector = createDeepEqualSelector(
  currentPageSelector,
  getExam,
  (page, exam) => page.results.map(id => exam[ id ])
)

export const examsWithDetailsSelector = createDeepEqualSelector(
  examsOnPageSelector,
  getDate,
  getLevel,
  getPosition,
  getPlace,
  getEmployee,
  getOrganisation,
  (exams, date, level, position, place, employee, organisation) =>
    exams.map(ex => ({
      ...ex,
      date: date[ ex.date ].date,
      level: level[ ex.level ].level,
      position: position[ ex.position ].name,
      place: place[ ex.place ],
      employee: {
        ...employee[ ex.employee ],
        org: organisation[ employee[ ex.employee ].org ]
      }
    }))
)

export const currentDatePageSelector = createDeepEqualSelector(
  getDatePage,
  page => page[ 1 ] || { results: [] }
)

export const currentLevelPageSelector = createDeepEqualSelector(
  getLevelPage,
  page => page[ 1 ] || { results: [] }
)

export const datesSelector = createDeepEqualSelector(
  currentDatePageSelector,
  getDate,
  (page, date) => page.results.map(id => date[ id ].date) || []
)

export const levelsSelector = createDeepEqualSelector(
  currentLevelPageSelector,
  getLevel,
  (page, level) => page.results.map(id => level[ id ].level) || []
)
