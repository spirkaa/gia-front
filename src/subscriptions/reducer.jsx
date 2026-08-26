import * as c from "./constants"

const SUBS_INITIAL_STATE = {
  subsMsg: {},
  isSubRequesting: false,
  isSubAddRequesting: false,
  isSubAddRequested: false,
  isSubDelRequesting: false,
  isSubDelRequested: false,
}

export function subs(state = SUBS_INITIAL_STATE, action) {
  switch (action.type) {
    case c.SUBS_REQUEST:
      return {
        isSubRequesting: true,
        subsMsg: {},
      }
    case c.SUBS_SUCCESS:
      return {
        isSubRequesting: false,
        subsMsg: {},
      }
    case c.SUBS_FAILURE:
      return {
        isSubRequesting: false,
        subsMsg: action.payload,
      }
    case c.SUBS_ADD_REQUEST:
      return {
        isSubAddRequesting: true,
        isSubAddRequested: false,
        subsMsg: {},
      }
    case c.SUBS_ADD_SUCCESS:
    case c.SUBS_ADD_FAILURE:
      return {
        isSubAddRequesting: false,
        isSubAddRequested: true,
        subsMsg: action.payload,
      }
    case c.SUBS_DEL_REQUEST:
      return {
        isSubDelRequesting: true,
        isSubDelRequested: false,
        subsMsg: {},
      }
    case c.SUBS_DEL_FAILURE:
    case c.SUBS_DEL_SUCCESS:
      return {
        isSubDelRequesting: false,
        isSubDelRequested: true,
        subsMsg: action.payload,
      }
    default:
      return state
  }
}

export function subsActivePage(state = 1, action) {
  if (action.type === c.SUBS_PAGE_SET) {
    return action.payload
  }
  return state
}
