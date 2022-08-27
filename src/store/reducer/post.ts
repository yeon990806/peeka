import produce from "immer";

import { CategoryType } from "@/common/defines/Category";
import { PostStateType } from "@/common/defines/Store";
import { addCommentAction, addReplyAction, deleteCommentAction, deletePostAction, deleteReplyAction, fetchCommentAction, fetchReplyAction, toggleLikeContentAction, toggleScrapContentAction, updateCommentAction, updatePostAction, updateReplyAction } from "@/common/defines/Action"

export const initialState: PostStateType = {
  mainPost: [],
  fetchedAllPost: false,
  fetchPostLoading: false,
  fetchPostSuccess: false,
  fetchPostError: false,
  fetchDone: false,
  addPostLoading: false,
  addPostSuccess: false,
  addPostError: false,
  updatePostLoading: false,
  updatePostSuccess: false,
  updatePostError: null,
  deletePostLoading: false,
  deletePostSuccess: false,
  deletePostError: false,
  postCategory: CategoryType.전체,
  displayImagePopup: false,
  popupIamgeArray: [],
  popupImageCurrentIdx: null,
}

export const FETCH_POST_REQUEST = 'FETCH_POST_REQUEST'
export const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS'
export const FETCH_POST_FAILURE = 'FETCH_POST_FAILURE'

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST'
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS'
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE'

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST'
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS'
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE'
export const UPDATE_MAINPOST = 'UPDATE_MAINPOST'

export const DELETE_POST_REQUEST = 'DELETE_POST_REQUEST'
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS'
export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE'
export const DELETE_MAINPOST = 'DELETE_MAINPOST'

export const FETCH_POST_COMMENT = 'FETCH_POST_COMMENT'
export const ADD_POST_COMMENT = 'ADD_POST_COMMENT'
export const UPDATE_POST_COMMENT = 'UPDATE_POST_COMMENT'
export const DELETE_POST_COMMENT = 'DELETE_POST_COMMENT'

export const TOGGLE_LIKE_MAINPOST = 'TOGGLE_LIKE_MAINPOST'
export const TOGGLE_SCRAP_MAINPOST = 'TOGGLE_SCRAP_MAINPOST'

export const FETCH_POST_COMMENT_REPLY = 'FETCH_POST_COMMENT_REPLY'
export const ADD_POST_COMMENT_REPLY = 'ADD_POST_COMMENT_REPLY'
export const UPDATE_POST_COMMENT_REPLY = 'UPDATE_POST_COMMENT_REPLY'
export const DELETE_POST_COMMENT_REPLY = 'DELETE_POST_COMMENT_REPLY'

export const CHANGE_POST_CATEGORY = 'CHANGE_POST_CATEGORY'
export const CHANGE_POPUP_IMAGES = 'CHANGE_POPUP_IMAGES'
export const TOGGLE_POPUP_DISPLAY = 'TOGGLE_POPUP_DISPLAY'
export const EMPTY_MAIN_POST = 'EMPTY_MAIN_POST'

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case FETCH_POST_REQUEST:
        draft.fetchPostLoading = true
        draft.fetchPostSuccess = false
        draft.fetchPostError = null

        break
      case FETCH_POST_SUCCESS:
        draft.fetchPostLoading = false
        draft.fetchPostSuccess = true

        if (action.data.post.length > 0 && !action.data.initPost) {
          const _post = draft.mainPost.findIndex(v => v.id === action.data.post[0].id)

          if (_post >= 0) return
        }

        if (action.data.post.length === 0) draft.fetchDone = true
        
        if (action.data.initPost) draft.mainPost = action.data.post
        else draft.mainPost = [ ...draft.mainPost, ...action.data.post ]
        
        break
      case FETCH_POST_FAILURE:
        draft.fetchPostLoading = false
        draft.fetchPostSuccess = false
        draft.fetchPostError = action.data
        
        break
      case ADD_POST_REQUEST:
        draft.addPostLoading = true
        draft.addPostSuccess = false
        draft.addPostError = null

        break
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false
        draft.addPostSuccess = true
        draft.mainPost = action.data
        
        break
      case ADD_POST_FAILURE:
        draft.addPostLoading = false
        draft.addPostSuccess = false
        draft.addPostError = action.error
        
        break
      case UPDATE_POST_REQUEST:
        draft.updatePostLoading = true
        draft.updatePostSuccess = false
        draft.updatePostError = null

        break
      case UPDATE_POST_SUCCESS:
        draft.updatePostLoading = false
        draft.updatePostSuccess = true

        break
      case UPDATE_MAINPOST:
        updatePostAction(action.data, draft.mainPost, action.data.onSuccess)

        break
      case UPDATE_POST_FAILURE:
        draft.updatePostLoading = false
        draft.updatePostError = action.error

        break
      case DELETE_POST_REQUEST:
        draft.deletePostLoading = true
        draft.deletePostSuccess = false
        draft.deletePostError = null

        break
      case DELETE_POST_SUCCESS:
        draft.deletePostLoading = false
        draft.deletePostSuccess = true
        
        break
      case DELETE_POST_FAILURE:
        draft.deletePostLoading = false
        draft.deletePostSuccess = false
        draft.deletePostError = action.error
        
        break
      case DELETE_MAINPOST:
        const filtered = deletePostAction(action.data.postId, draft.mainPost, action.data.onSuccess)

        draft.mainPost = filtered
        
        break
      case FETCH_POST_COMMENT:
        fetchCommentAction({ ...action.data }, draft.mainPost)

        break
      case ADD_POST_COMMENT:
        addCommentAction({ ...action.data }, draft.mainPost, action.data.onSuccess)

        break
      case UPDATE_POST_COMMENT:
        updateCommentAction({ ...action.data }, draft.mainPost, action.data.onSuccess)
        
        break
      case DELETE_POST_COMMENT:
        deleteCommentAction({ ...action.data }, draft.mainPost, action.data.onSuccess)

        break
      case FETCH_POST_COMMENT_REPLY:
        fetchReplyAction({ ...action.data }, draft.mainPost)

        break
      case ADD_POST_COMMENT_REPLY:
        addReplyAction({ ...action.data }, draft.mainPost, action.data.onSuccess)

        break
      case UPDATE_POST_COMMENT_REPLY:
        updateReplyAction({ ...action.data }, draft.mainPost, action.data.onSuccess)

        break
      case DELETE_POST_COMMENT_REPLY:
        deleteReplyAction({ ...action.data }, draft.mainPost, action.data.onSuccess)

        break
      case TOGGLE_LIKE_MAINPOST:
        toggleLikeContentAction({ ...action.data }, draft.mainPost)
        break
      case TOGGLE_SCRAP_MAINPOST:
        toggleScrapContentAction({ ...action.data }, draft.mainPost)

        break
      case CHANGE_POST_CATEGORY:
        draft.postCategory = action.data
        break
      case CHANGE_POPUP_IMAGES:
        draft.popupIamgeArray = action.data.images
        draft.popupImageCurrentIdx = action.data.idx
        draft.displayImagePopup = !draft.displayImagePopup

        break
      case TOGGLE_POPUP_DISPLAY:
        draft.displayImagePopup = !draft.displayImagePopup
        break
      case EMPTY_MAIN_POST:
        draft.mainPost = []

        break
      default:
        return state
    }
  })
}

export default reducer