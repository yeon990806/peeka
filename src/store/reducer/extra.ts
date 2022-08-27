import { addReplyAction, deletePostAction, deleteReplyAction, fetchReplyAction, toggleLikeContentAction, toggleScrapContentAction, updatePostAction, updateReplyAction } from '@/common/defines/Action';
import { addCommentAction, deleteCommentAction, updateCommentAction } from '@/common/defines/Action';
import { fetchCommentAction } from '@/common/defines/Action';
import { ExtraStateType } from '@/common/defines/Store';
import produce from 'immer';

export const initialState: ExtraStateType = {
  extraList: [],
  extraUserInfo: {
    birthday: '',
    email: '',
    gender: '',
    id: null,
    image: {
      uploadedFileURL: '',
      uploadedFileKey: ''
    },
    member_code: '',
    nickname: ''
  },
  fetchExtraListRequest: false,
  fetchExtraListSuccess: false,
  fetchExtraListError: null,
  fetchDone: false,
  fetchLinkedPostRequest: false,
  fetchLinkedPostSuccess: false,
  fetchLinkedPostError: null,
}

export const EMPTY_EXTRA_LIST = 'EMPTY_EXTRA_LIST'

export const FETCH_EXTRAPOST_REQUEST = 'FETCH_EXTRALIST_REQUEST'
export const FETCH_EXTRAPOST_SUCCESS = 'FETCH_EXTRALIST_SUCCESS'
export const FETCH_EXTRAPOST_FAILURE = 'FETCH_ETRALIST_FAILURE'

export const UPDATE_EXTRAPOST = 'UPDATE_EXTRAPOST'
export const DELETE_EXTRAPOST = 'DELETE_EXTRAPOST'

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

export const TOGGLE_LIKE_EXTRAPOST = 'TOGGLE_LIKE_EXTRAPOST'
export const TOGGLE_SCRAP_EXTRAPOST = 'TOGGLE_SCRAP_EXTRAPOST'

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
      const list = "posts" in action.data ? action.data.posts : action.data

      draft.fetchExtraListRequest = false
      draft.fetchExtraListSuccess = true

      if (action.data.length > 0) {
        const _post = draft.extraList.findIndex(v => v.id === list[0].id)

        if (_post >= 0) return
      }

      if (action.data.length === 0) draft.fetchDone = true
 
      draft.extraList = [...draft.extraList, ...list]
      if ("member" in action.data) draft.extraUserInfo = action.data.member

      break
    case FETCH_EXTRAPOST_FAILURE:
      draft.fetchExtraListRequest = false
      draft.fetchExtraListError = action.error
      
      break
    case UPDATE_EXTRAPOST:
      updatePostAction(action.data, draft.extraList, action.data.onSuccess)
      
      break
    case DELETE_EXTRAPOST:
      const arr = deletePostAction(action.data.postId, draft.extraList, action.data.onSuccess)

      draft.extraList = arr
      
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
      addCommentAction({ ...action.data }, draft.extraList, action.data.onSuccess)

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
      addReplyAction({ ...action.data }, draft.extraList, action.data.onSuccess)

      break
    case UPDATE_EXTRAPOST_COMMENT_REPLY:
      updateReplyAction({ ...action.data }, draft.extraList, action.data.onSuccess)

      break
    case DELETE_EXTRAPOST_COMMENT_REPLY:
      deleteReplyAction({ ...action.data }, draft.extraList, action.data.onSuccess)

      break
    case TOGGLE_LIKE_EXTRAPOST:
      toggleLikeContentAction({ ...action.data }, draft.extraList)

      break
    case TOGGLE_SCRAP_EXTRAPOST:
      toggleScrapContentAction({ ...action.data }, draft.extraList)

      break
    default:
      return state
  }
})

export default reducer