import produce from "immer"

export const initialState = {
  fetchCommentLoading: false,
  fetchCommentSuccess: false,
  fetchCommentError: null,
  addCommentLoading: false,
  addCommentSuccess: false,
  addCommentError: null,
  updateCommentLoading: false,
  updateCommentSuccess: false,
  updateCommentError: null,
  deleteCommentLoading: false,
  deleteCommentSuccess: false,
  deleteCommentError: null
}

export const FETCH_COMMENT_REQUEST = 'FETCH_COMMENT_REQUEST'
export const FETCH_COMMENT_SUCCESS = 'FETCH_COMMENT_SUCCESS'
export const FETCH_COMMENT_FAILURE = 'FETCH_COMMENT_FAILURE'

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST'
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS'
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE'

export const UPDATE_COMMENT_REQUEST = 'UPDATE_COMMENT_REQUEST'
export const UPDATE_COMMENT_SUCCESS = 'UPDATE_COMMENT_SUCCESS'
export const UPDATE_COMMENT_FAILURE = 'UPDATE_COMMENT_FAILURE'

export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST'
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS'
export const DELETE_COMMENT_FAILURE = 'DELETE_COMMENT_FAILURE'

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case FETCH_COMMENT_REQUEST:
        draft.fetchCommentLoading = true
        draft.fetchCommentSuccess = false
        draft.fetchCommentError = null

        break
      case FETCH_COMMENT_SUCCESS:
        draft.fetchCommentLoading = false
        draft.fetchCommentSuccess = true
        
        break
      case FETCH_COMMENT_FAILURE:
        draft.fetchCommentLoading = false
        draft.fetchCommentError = action.error

        break
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true
        draft.addCommentSuccess = false
        draft.addCommentError = null

        break
      case ADD_COMMENT_SUCCESS:
        draft.addCommentLoading = false
        draft.addCommentSuccess = true

        break
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false
        draft.addCommentError = action.error
        
        break
      case UPDATE_COMMENT_REQUEST:
        draft.updateCommentLoading = true
        draft.updateCommentSuccess = false
        draft.updateCommentError = action.error

        break
      case UPDATE_COMMENT_SUCCESS:
        draft.updateCommentLoading = false
        draft.updateCommentSuccess = true

        break
      case UPDATE_COMMENT_FAILURE:
        draft.updateCommentLoading = false
        draft.updateCommentError = action.error

        break
      case DELETE_COMMENT_REQUEST:
        draft.deleteCommentLoading = true
        draft.deleteCommentSuccess = false
        draft.deleteCommentError = null

        break
      case DELETE_COMMENT_SUCCESS:
        draft.deleteCommentLoading = false
        draft.deleteCommentSuccess = true

        break
      case DELETE_COMMENT_FAILURE:
        draft.deleteCommentLoading = false
        draft.deleteCommentError = action.error

        break
      default:
        return state
    }
  })
}

export default reducer