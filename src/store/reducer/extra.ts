import { addReplyAction, deletePostAction, fetchReplyAction, likeContentAction, scrapContentAction, unlikeContentAction, unscrapContentAction, updatePostAction, updateReplyAction } from '@/common/defines/Action';
import { addCommentAction, deleteCommentAction, updateCommentAction } from '@/common/defines/Action';
import { fetchCommentAction } from '@/common/defines/Action';
import { ExtraStateType } from '@/common/defines/Store';
import produce from 'immer';

export const initialState: ExtraStateType = {
  extraList: [],
  fetchExtraListRequest: false,
  fetchExtraListSuccess: false,
  fetchExtraListError: null,
  updateExtraListLoading: false,
  updateExtraListSuccess: false,
  updateExtraListError: null,
  deleteExtraListLoading: false,
  deleteExtraListSuccess: false,
  deleteExtraListError: null,
  fetchLinkedPostRequest: false,
  fetchLinkedPostSuccess: false,
  fetchLinkedPostError: null,
}

export const EMPTY_EXTRA_LIST = 'EMPTY_EXTRA_LIST'

export const FETCH_EXTRAPOST_REQUEST = 'FETCH_EXTRALIST_REQUEST'
export const FETCH_EXTRAPOST_SUCCESS = 'FETCH_EXTRALIST_SUCCESS'
export const FETCH_EXTRAPOST_FAILURE = 'FETCH_ETRALIST_FAILURE'

export const UPDATE_EXTRAPOST_REQUEST = 'UPDATE_EXTRAPOST_REQUEST'
export const UPDATE_EXTRAPOST_SUCCESS = 'UPDATE_EXTRAPOST_SUCCESS'
export const UPDATE_EXTRAPOST_FAILURE = 'UPDATE_EXTRAPOST_FAILURE'

export const DELETE_EXTRAPOST_REQUEST = 'DELETE_EXTRAPOST_REQUEST'
export const DELETE_EXTRAPOST_SUCCESS = 'DELETE_EXTRAPOST_SUCCESS'
export const DELETE_EXTRAPOST_FAILURE = 'DELETE_EXTRAPOST_FAILURE'

export const FETCH_LINKEDPOST_REQUEST = 'FETCH_LINKEDPOST_REQUEST'
export const FETCH_LINKEDPOST_SUCCESS = 'FETCH_LINKEDPOST_SUCCESS'
export const FETCH_LINKEDPOST_FAILURE = 'FETCH_LINKEDPOST_FAILURE'

export const FETCH_EXTRAPOST_COMMENT = 'FETCH_EXTRAPOST_COMMENT'
export const ADD_EXTRAPOST_COMMENT = 'ADD_EXTRAPOST_COMMENT'
export const UPDATE_EXTRAPOST_COMMENT = 'UPDATE_EXTRAPOST_COMMENT'
export const DELETE_EXTRAPOST_COMMENT = 'DELETE_EXTRAPOST_COMMENT'

export const FETCH_EXTRAPOST_COMMENT_REPLY = 'FETCH_EXTRAPOST_COMMENT_REPLY'
export const ADD_EXTRAPOST_COMMENT_REPLY = 'ADD_EXTRAPOST_COMMENT_REPLY'
export const UPDATE_EXTRAPOST_COMMENT_REPLY = 'UPDATE_EXTRAPOST_COMMENT_REPLY'
export const DELETE_EXTRAPOST_COMMENT_REPLY = 'DELETE_EXTRAPOST_COMMENT_REPLY'

export const LIKE_EXTRAPOST_CONTENT = 'LIKE_EXTRAPOST_CONTENT'
export const UNLIKE_EXTRAPOST_CONTENT = 'UNLIKE_EXTRAPOST_CONTENT'
export const SCRAP_EXTRAPOST = 'SCRAP_EXTRAPOST'
export const UNSCRAP_EXTRAPOST = 'UNSCRAP_EXTRAPOST'

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case EMPTY_EXTRA_LIST:
      draft.fetchExtraListRequest = false
      draft.fetchExtraListSuccess = false
      draft.fetchExtraListError = null
      draft.extraList = []
      
      break
    case FETCH_EXTRAPOST_REQUEST:
      draft.fetchExtraListRequest = true
      draft.fetchExtraListSuccess = false
      draft.fetchExtraListError = null

      break
    case FETCH_EXTRAPOST_SUCCESS:
      draft.fetchExtraListRequest = false
      draft.fetchExtraListSuccess = true

      if (action.data.length > 0) {
        const _post = draft.extraList.findIndex(v => v.id === action.data[0].id)

        if (_post >= 0) return
      }
 
      draft.extraList = [...draft.extraList, ...action.data.list]

      break
    case FETCH_EXTRAPOST_FAILURE:
      draft.fetchExtraListRequest = false
      draft.fetchExtraListError = action.error
      
      break
    case UPDATE_EXTRAPOST_REQUEST:
      draft.updateExtraListLoading = true
      draft.updateExtraListSuccess = false
      draft.updateExtraListError = null

      break
    case UPDATE_EXTRAPOST_SUCCESS:
      draft.updateExtraListLoading = false
      draft.updateExtraListSuccess = true
      
      break
    case UPDATE_EXTRAPOST_FAILURE:
      draft.updateExtraListLoading = false
      draft.updateExtraListError = action.error
      
      break
    case DELETE_EXTRAPOST_REQUEST:
      draft.deleteExtraListLoading = true
      draft.deleteExtraListSuccess = false
      draft.deleteExtraListError = null

      break
    case DELETE_EXTRAPOST_SUCCESS:
      draft.updateExtraListLoading = false
      draft.updateExtraListSuccess = true

      updatePostAction(action.data, draft.extraList, action.data.onSuccess)
      
      break
    case DELETE_EXTRAPOST_FAILURE:
      draft.updateExtraListLoading = false
      draft.deleteExtraListError = action.error

      deletePostAction(action.data, draft.extraList, action.data.onnSuccess)
      
      break
    case FETCH_LINKEDPOST_REQUEST:
      draft.fetchLinkedPostRequest = true
      draft.fetchLinkedPostSuccess = false
      draft.fetchLinkedPostError = null

      break
    case FETCH_LINKEDPOST_SUCCESS:
      draft.fetchLinkedPostRequest = false
      draft.fetchLinkedPostSuccess = true

      draft.extraList = [action.data.post]

      break
    case FETCH_LINKEDPOST_FAILURE:
      draft.fetchLinkedPostRequest = false
      draft.fetchLinkedPostError = action.error

      break
    case FETCH_EXTRAPOST_COMMENT:
      fetchCommentAction({ ...action.data }, draft.extraList)

      break
    case ADD_EXTRAPOST_COMMENT:
      addCommentAction({ ...action.data }, draft.extraList)

      break
    case UPDATE_EXTRAPOST_COMMENT:
      updateCommentAction({ ...action.data }, draft.extraList, action.data.onSuccess)

      break
    case DELETE_EXTRAPOST_COMMENT:
      deleteCommentAction({ ...action.data }, draft.extraList, action.data.onSuccess)

      break
    case FETCH_EXTRAPOST_COMMENT_REPLY:
      fetchReplyAction({ ...action.data }, draft.extraList)

      break
    case ADD_EXTRAPOST_COMMENT_REPLY:
      addReplyAction({ ...action.data }, draft.extraList)

      break
    case UPDATE_EXTRAPOST_COMMENT_REPLY:
      updateReplyAction({ ...action.data }, draft.extraList, action.data.onSuccess)

      break
    case DELETE_EXTRAPOST_COMMENT_REPLY:
      deleteCommentAction({ ...action.data }, draft.extraList, action.data.onSuccess)

      break
    case LIKE_EXTRAPOST_CONTENT:
      likeContentAction({ ...action.data }, draft.extraList)

      break
    case UNLIKE_EXTRAPOST_CONTENT:
      unlikeContentAction({ ...action.data }, draft.extraList)

      break
    case SCRAP_EXTRAPOST:
      scrapContentAction({ ...action.data }, draft.extraList)

      break
    case UNSCRAP_EXTRAPOST:
      unscrapContentAction({ ...action.data }, draft.extraList)

      break
    default:
      return state
  }
})

export default reducer