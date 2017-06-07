import Schemas from '../middleware/schemas'
import { actionTrigger, actionWithPayload, authApi, loadThis } from '../main/actions'

import * as c from './constants'

const SUBS_ENDPOINT = 'subscription'

export function subsLoad (jwt, id = 1) {
  return loadThis({
    id: id,
    source: 'subsPage',
    types: [
      c.SUBS_REQUEST,
      c.SUBS_SUCCESS,
      c.SUBS_FAILURE,
    ],
    endpoint: `${SUBS_ENDPOINT}/?page=${id}`,
    schema: Schemas.SUBS_PAGE,
    data: { jwt },
    method: 'GET',
    requiredFields: [ 'random' ]
  })
}

export function subsAdd (jwt, employee) {
  return authApi({
    types: [
      c.SUBS_ADD_REQUEST,
      c.SUBS_ADD_SUCCESS,
      c.SUBS_ADD_FAILURE,
    ],
    endpoint: `${SUBS_ENDPOINT}/`,
    data: { jwt, employee },
    method: 'POST',
  })
}

export function subsDel (jwt, sub) {
  return authApi({
    types: [
      c.SUBS_DEL_REQUEST,
      c.SUBS_DEL_SUCCESS,
      c.SUBS_DEL_FAILURE,
    ],
    endpoint: `${SUBS_ENDPOINT}/${sub}/`,
    data: { jwt },
    method: 'DELETE',
  })
}

export const subsClearPages = () =>
  actionTrigger(c.SUBS_CLEAR_PAGES)

export const subsPageSet = (page) =>
  actionWithPayload(c.SUBS_PAGE_SET, page)