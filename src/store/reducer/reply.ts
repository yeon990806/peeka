import { ReplyStateType } from "@/common/defines/Store"
import produce from "immer"

export const initialState: ReplyStateType = {
  fetchReplyLoading: false,
  fetchReplySuccess: false,
  fetchReplyError: null,
  addReplyLoading: false,
  addReplySuccess: false,
  addReplyError: null,
  updateReplyLoading: false,
  updateReplySuccess: false,
  updateReplyError: null,
  deleteReplyLoading: false,
  deleteReplySuccess: false,
  deleteReplyError: null
}

export const FETCH_REPLY_REQUEST = 'FETCH_REPLY_REQUEST'
export const FETCH_REPLY_SUCCESS = 'FETCH_REPLY_SUCCESS'
export const FETCH_REPLY_FAILURE = 'FETCH_REPLY_FAILURE'

export const ADD_REPLY_REQUEST = 'ADD_REPLY_REQUEST'
export const ADD_REPLY_SUCCESS = 'ADD_REPLY_SUCCESS'
export const ADD_REPLY_FAILURE = 'ADD_REPLY_FAILURE'

export const UPDATE_REPLY_REQUEST = 'UPDATE_REPLY_REQUEST'
export const UPDATE_REPLY_SUCCESS = 'UPDATE_REPLY_SUCCESS'
export const UPDATE_REPLY_FAILURE = 'UPDATE_REPLY_FAILURE'

export const DELETE_REPLY_REQUEST = 'DELETE_REPLY_REQUEST'
export const DELETE_REPLY_SUCCESS = 'DELETE_REPLY_SUCCESS'
export const DELETE_REPLY_FAILURE = 'DELETE_REPLY_FAILURE'

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case FETCH_REPLY_REQUEST:
        draft.fetchReplyLoading = true
        draft.fetchReplySuccess = false
        draft.fetchReplyError = null

        break
      case FETCH_REPLY_SUCCESS:
        draft.fetchReplyLoading = false
        draft.fetchReplySuccess = true
        
        break
      case FETCH_REPLY_FAILURE:
        draft.fetchReplyLoading = false
        draft.fetchReplyError = action.error

        break
      case ADD_REPLY_REQUEST:
        draft.addReplyLoading = true
        draft.addReplySuccess = false
        draft.addReplyError = null

        break
      case ADD_REPLY_SUCCESS:
        draft.addReplyLoading = false
        draft.addReplySuccess = true

        break
      case ADD_REPLY_FAILURE:
        draft.addReplyLoading = false
        draft.addReplyError = action.error
        
        break
      case UPDATE_REPLY_REQUEST:
        draft.updateReplyLoading = true
        draft.updateReplySuccess = false
        draft.updateReplyError = action.error

        break
      case UPDATE_REPLY_SUCCESS:
        draft.updateReplyLoading = false
        draft.updateReplySuccess = true

        break
      case UPDATE_REPLY_FAILURE:
        draft.updateReplyLoading = false
        draft.updateReplyError = action.error

        break
      case DELETE_REPLY_REQUEST:
        draft.deleteReplyLoading = true
        draft.deleteReplySuccess = false
        draft.deleteReplyError = null

        break
      case DELETE_REPLY_SUCCESS:
        draft.deleteReplyLoading = false
        draft.deleteReplySuccess = true

        break
      case DELETE_REPLY_FAILURE:
        draft.deleteReplyLoading = false
        draft.deleteReplyError = action.error

        break
      default:
        return state
    }
  })
}

export default reducer