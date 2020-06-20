import Schemas from "../middleware/schemas"
import { loadThis, actionTrigger, actionWithPayload } from "../main/actions"
import { ORG_FILTER_INITIAL_STATE } from "./reducer"

const ORGANISATION_ENDPOINT = "organisation"

export const ORGANISATIONS_REQUEST = "ORGANISATIONS_REQUEST"
export const ORGANISATIONS_SUCCESS = "ORGANISATIONS_SUCCESS"
export const ORGANISATIONS_FAILURE = "ORGANISATIONS_FAILURE"

export const ORGANISATION_REQUEST = "ORGANISATION_REQUEST"
export const ORGANISATION_SUCCESS = "ORGANISATION_SUCCESS"
export const ORGANISATION_FAILURE = "ORGANISATION_FAILURE"

export const ORGANISATIONS_FILTER_SET = "ORGANISATIONS_FILTER_SET"
export const ORGANISATIONS_FILTER_CLEAR_PAGES = "ORGANISATIONS_FILTER_CLEAR_PAGES"
export const ORGANISATIONS_PAGE_SET = "ORGANISATIONS_PAGE_SET"

export function loadOrganisations(id = 1, filter = ORG_FILTER_INITIAL_STATE) {
  const { search } = filter
  return loadThis({
    id: id,
    source: "orgPage",
    types: [ORGANISATIONS_REQUEST, ORGANISATIONS_SUCCESS, ORGANISATIONS_FAILURE],
    schema: Schemas.ORG_PAGE,
    endpoint: `${ORGANISATION_ENDPOINT}/?search=${search}&page=${id}`,
  })
}

export function loadOrgDetail(id) {
  return loadThis({
    id: id,
    source: ORGANISATION_ENDPOINT,
    types: [ORGANISATION_REQUEST, ORGANISATION_SUCCESS, ORGANISATION_FAILURE],
    schema: Schemas.ORG_DETAIL,
    endpoint: `${ORGANISATION_ENDPOINT}/${id}/`,
    requiredFields: ["employees"],
  })
}

export const orgFilterSet = (filter) =>
  actionWithPayload(ORGANISATIONS_FILTER_SET, filter)

export const orgFilterClearPages = () => actionTrigger(ORGANISATIONS_FILTER_CLEAR_PAGES)

export const orgPageSet = (page) => actionWithPayload(ORGANISATIONS_PAGE_SET, page)
