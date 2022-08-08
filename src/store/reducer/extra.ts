import { addReplyAction, fetchReplyAction, likeContentAction, scrapContentAction, unlikeContentAction, unscrapContentAction, updateReplyAction } from '@/common/defines/Action';
import { addCommentAction, deleteCommentAction, updateCommentAction } from '@/common/defines/Action';
import { fetchCommentAction } from '@/common/defines/Action';
import { ExtraStateType } from '@/common/defines/Store';
import produce from 'immer';

export const initialState: ExtraStateType = {
  extraList: [],
  fetchExtraListRequest: false,
  fetchExtraListSuccess: false,
  fetchExtraListError: null,
}

export const EMPTY_EXTRA_LIST = 'EMPTY_EXTRA_LIST'

export const FETCH_EXTRAPOST_REQUEST = 'FETCH_EXTRALIST_REQUEST'
export const FETCH_EXTRAPOST_SUCCESS = 'FETCH_EXTRALIST_SUCCESS'
export const FETCH_EXTRAPOST_FAILURE = 'FETCH_ETRALIST_FAILURE'

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
        debugger
        const _post = draft.extraList.findIndex(v => v.id === action.data[0].id)

        if (_post >= 0) return
      }
 
      draft.extraList = [...draft.extraList, ...action.data.list]

      break
    case FETCH_EXTRAPOST_FAILURE:
      draft.fetchExtraListRequest = false
      draft.fetchExtraListError = action.error

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