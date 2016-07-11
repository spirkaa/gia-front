import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

export const getDatePage = state => state.entities.datePage
export const getLevelPage = state => state.entities.levelPage
export const getEmpPage = state => state.entities.empPage
export const getExamPage = state => state.entities.examPage
export const getOrgPage = state => state.entities.orgPage
export const getPlacesPage = state => state.entities.placesPage

export const getEmployee = state => state.entities.employee
export const getExam = state => state.entities.exam
export const getDate = state => state.entities.date
export const getLevel = state => state.entities.level
export const getPosition = state => state.entities.position
export const getOrganisation = state => state.entities.organisation
export const getPlace = state => state.entities.place
export const getTerritory = state => state.entities.territory

export const getEmpFilter = state => state.filters.empFilter
export const getExamFilter = state => state.filters.examFilter
export const getOrgFilter = state => state.filters.orgFilter
export const getPlacesFilter = state => state.filters.placesFilter

export const getEmpActivePage = state => state.pagination.empActivePage
export const getExamActivePage = state => state.pagination.examActivePage
export const getOrgActivePage = state => state.pagination.orgActivePage
export const getPlacesActivePage = state => state.pagination.placesActivePage

export default createDeepEqualSelector