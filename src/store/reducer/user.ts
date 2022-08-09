import produce from "immer"

import { UserType } from "@/common/defines/Store"
import { setCookie, removeCookie } from "@/common/libs/Cookie"
import { fetchCommentAction, addCommentAction, updateCommentAction, deleteCommentAction, fetchReplyAction, addReplyAction, updateReplyAction, deleteReplyAction, likeContentAction, unlikeContentAction, scrapContentAction, unscrapContentAction } from "@/common/defines/Action"

export const initialState: UserType = {
  alwaysSignIn: false,
  fetchUserInfoLoading: false,
  fetchUserInfoSuccess: false,
  fetchUserInfoError: null,
  signInLoading: false,
  signInSuccess: false,
  signInError: false,
  signUpLoading: false,
  signUpSuccess: false,
  signUpError: false,
  signOutLoading: false,
  signOutSuccess: false,
  signOutError: false,
  userPostLoading: false,
  userPostSuccess: false,
  userPostError: false,
  fetchAlertLoading: false,
  fetchAlertSuccess: false,
  fetchAlertError: false,
  readAlertLoading: false,
  readAlertSuccess: false,
  readAlertError: false,
  signinData: {},
  signupData: {},
  userInfo: {
    id: null,
    nickname: '',
    alertList: [],
    alertDetail: null,
  },
  userPost: [],
}

export const TOGGLE_ALWAYS_SIGN_IN = 'ALWAYS_SIGN_IN_REQUEST'
export const UPDATE_USERINFO = 'UPDATE_USERINFO'

export const FETCH_USERINFO_REQUEST = 'FETCH_USERINFO_REQUEST'
export const FETCH_USERINFO_SUCCESS = 'FETCH_USERINFO_SUCCESS'
export const FETCH_USERINFO_FAILURE = 'FETCH_USERINFO_FAILURE'

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST'
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS'
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE'

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST'
export const SIGN_UP_SUCCESS = 'SIGN_UP_REQUEST'
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE'

export const SIGN_OUT_REQUEST = 'SIGN_OUT_REQUEST'
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS'
export const SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE'

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST'
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS'
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE'

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST'
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS'
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE'

export const USER_POST_REQUEST = 'USER_POST_REQUEST'
export const USER_POST_SUCCESS = 'USER_POST_SUCCESS'
export const USER_POST_FAILURE = 'USER_POST_FAILURE'

export const FETCH_USERPOST_COMMENT = 'FETCH_USERPOST_COMMENT'
export const ADD_USERPOST_COMMENT = 'ADD_USERPOST_COMMENT'
export const UPDATE_USERPOST_COMMENT = 'UPDATE_USERPOST_COMMENT'
export const DELETE_USERPOST_COMMENT = 'DELETE_USERPOST_COMMENT'

export const FETCH_USERPOST_COMMENT_REPLY = 'FETCH_USERPOST_COMMENT_REPLY'
export const ADD_USERPOST_COMMENT_REPLY = 'ADD_USERPOST_COMMENT_REPLY'
export const UPDATE_USERPOST_COMMENT_REPLY = 'UPDATE_USERPOST_COMMENT_REPLY'
export const DELETE_USERPOST_COMMENT_REPLY = 'DELETE_USERPOST_COMMENT_REPLY'

export const RESET_USER_POST = 'RESET_USER_POST'

export const LIKE_USERPOST_CONTENT = 'LIKE_USERPOST_CONTENT'
export const UNLIKE_USERPOST_CONTENT = 'UNLIKE_USERPOST_CONTENT'
export const SCRAP_USERPOST = 'SCRAP_USERPOST'
export const UNSCRAP_USERPOST = 'UNSCRAP_USERPOST'

export const FETCH_ALERT_REQUEST = 'FETCH_ALERT_REQUEST'
export const FETCH_ALERT_SUCCESS = 'FETCH_ALERT_SUCCESS'
export const FETCH_ALERT_FAILURE = 'FETCH_ALERT_FAILURE'

export const READ_ALERT_REQUEST = 'READ_ALERT_REQUEST'
export const READ_ALERT_SUCCESS = 'READ_ALERT_SUCCESS'
export const READ_ALERT_FAILURE = 'READ_ALERT_FAILURE'

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME'
export const DELETE_POST_TO_ME = 'DELETE_POST_TO_ME'

export const SET_SIGN_UP_PARAMETER = 'SET_SIGN_UP_PARAMETER'

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case TOGGLE_ALWAYS_SIGN_IN:
      draft.alwaysSignIn = !draft.alwaysSignIn

      break
    case UPDATE_USERINFO:
      draft.userInfo = {
        ...draft.userInfo,
        ...action.data,
      }
      
      break;
    case FETCH_USERINFO_REQUEST:
      draft.fetchUserInfoLoading = true
      draft.fetchUserInfoSuccess = false
      draft.fetchUserInfoError = null

      break
    case FETCH_USERINFO_SUCCESS:
      draft.fetchUserInfoLoading = false
      draft.fetchUserInfoSuccess = true
      draft.userInfo = action.data
      
      break
    case FETCH_USERINFO_FAILURE:
      draft.fetchUserInfoLoading = false
      draft.fetchUserInfoError = action.error

      break
    case SIGN_IN_REQUEST:
      draft.signInLoading = true
      draft.signInSuccess = false
      draft.signInError = null

      break
    case SIGN_IN_SUCCESS: {
      draft.signInLoading = false
      draft.signInSuccess = true
      draft.userInfo = action.data

      const userInfo = {
        id: action.data.id,
        nick_name: action.data.nick_name,
        grant_type: action.data.grant_type,
      }

      setCookie('accessToken', action.data.access_token, {
        path: '/',
        secure: true,
        expires: new Date(Date.now() + (6 * 3600 * 1000)),
      })
      setCookie('refreshToken', action.data.refresh_token, {
        path: '/',
        secure: true,
      })
      setCookie('userInfo', JSON.stringify(userInfo), {
        path: '/',
        secure: true,
      })

      break
    }
    case SIGN_IN_FAILURE:
      draft.signInLoading = false
      draft.signInError = true

      break
    case SET_SIGN_UP_PARAMETER:
      draft.signupData = {
        ...draft.signupData,
        ...action.data
      }
    case SIGN_UP_REQUEST:
      draft.signUpLoading = true
      draft.signUpSuccess = false
      draft.signUpError = null

      break
    case SIGN_UP_SUCCESS: {
      const userInfo = {
        id: action.data.id,
        nick_name: action.data.nick_name,
        grant_type: action.data.grant_type,
      }

      draft.signUpLoading = false
      draft.signUpSuccess = true

      draft.userInfo = {
        id: action.data.id,
        nickname: action.data.nickname,
        grant_type: action.data.grant_type,
        alertList: [],
        alertDetail: null,
      }

      setCookie('accessToken', action.data.access_token, {
        path: '/',
        secure: true,
        expires: new Date(Date.now() + (6 * 3600 * 1000)),
      })
      setCookie('refreshToken', action.data.refresh_token, {
        path: '/',
        secure: true,
      })
      setCookie('userInfo', JSON.stringify(userInfo), {
        path: '/',
        secure: true,
      })

      break
    }
    case SIGN_UP_FAILURE:
      draft.signUpLoading = false
      draft.signUpError = action.error

      break  
    case SIGN_OUT_REQUEST:
      draft.signOutLoading = false
      draft.signOutSuccess = false
      draft.signOutError = null

      break
    case SIGN_OUT_SUCCESS:
      draft.signOutLoading = false
      draft.signOutSuccess = true
      draft.userInfo = {
        id: null,
        image: {
          uploadedFileURL: '',
          uploadedFileKey: '',
        },
        nickname: '',

        alertList: [],
        alertDetail: null,
      }

      removeCookie('accessToken')
      removeCookie('refreshToken')
      removeCookie('userInfo')

      break
    case SIGN_OUT_FAILURE:
      draft.signOutLoading = false
      draft.signOutError = action.error

      break
    case USER_POST_REQUEST:
      draft.userPostLoading = true
      draft.userPostSuccess = false
      draft.userPostError = null

      break
    case USER_POST_SUCCESS:
      draft.userPostLoading = false
      draft.userPostSuccess = true

      if (action.data.length > 0) {
        const _post = draft.userPost.findIndex(v => v.id === action.data[0].id)

        if (_post >= 0) return
      }

      draft.userPost = [ ...draft.userPost, ...action.data ]

      break
    case USER_POST_FAILURE:
      draft.userPostLoading = false
      draft.userPostError = action.error

      break
    case FETCH_USERPOST_COMMENT:
      fetchCommentAction({ ...action.data }, draft.userPost)
  
      break
    case ADD_USERPOST_COMMENT:
      addCommentAction({ ...action.data }, draft.userPost)

      break
    case UPDATE_USERPOST_COMMENT:
      updateCommentAction({ ...action.data }, draft.userPost, action.data.onSuccess)
      
      break
    case DELETE_USERPOST_COMMENT:
      deleteCommentAction({ ...action.data }, draft.userPost, action.data.onSuccess)

      break
    case FETCH_USERPOST_COMMENT_REPLY:
      fetchReplyAction({ ...action.data }, draft.userPost)

      break
    case ADD_USERPOST_COMMENT_REPLY:
      addReplyAction({ ...action.data }, draft.userPost)

      break
    case UPDATE_USERPOST_COMMENT_REPLY:
      updateReplyAction({ ...action.data }, draft.userPost, action.data.onSuccess)

      break
    case DELETE_USERPOST_COMMENT_REPLY:
      deleteReplyAction({ ...action.data }, draft.userPost, action.data.onSuccess)

      break
    case LIKE_USERPOST_CONTENT:
      likeContentAction({ ...action.data }, draft.userPost)

      break
    case UNLIKE_USERPOST_CONTENT:
      unlikeContentAction({ ...action.data }, draft.userPost)
      
      break
    case SCRAP_USERPOST:
      scrapContentAction({ ...action.data }, draft.userPost)

      break
    case UNSCRAP_USERPOST:
      unscrapContentAction({ ...action.data }, draft.userPost)

      break
    case FETCH_ALERT_REQUEST:
      draft.fetchAlertLoading = true
      draft.fetchAlertSuccess = false
      draft.fetchAlertError = null

      break
    case FETCH_ALERT_SUCCESS:
      draft.fetchAlertLoading = false
      draft.fetchAlertSuccess = true
      
      if (draft.userInfo.alertList && draft.userInfo.alertList.length > 0)
        draft.userInfo.alertList = action.data.concat(draft.userInfo.alertList)
      else 
        draft.userInfo.alertList = action.data
      
      break
    case FETCH_ALERT_FAILURE:
      draft.fetchAlertLoading = false
      draft.fetchAlertError = action.error

      break
    case READ_ALERT_REQUEST:
      draft.readAlertLoading = true
      draft.readAlertSuccess = false
      draft.readAlertError = null

      break
    case READ_ALERT_SUCCESS: {
      const post = action.data.post.post
      
      draft.readAlertLoading = false
      draft.readAlertSuccess = true

      draft.userInfo.alertDetail = post
      draft.userInfo.alertDetail.comment_list = action.data.post.comments

      if (action.data.post.replies)
        action.data.post.replies.map((r) => {
          const reply = draft.userInfo.alertDetail.comment_list.find(v => v.id === r.comment_id)

          if (reply) {
            if ('reply_list' in reply) reply.reply_list.push(r)
            else {
              reply.reply_list = []

              reply.reply_list.push(r)
            }
          }
        })
      
      if (action.data.onSuccess) action.data.onSuccess()
      
      break
    }
    case READ_ALERT_FAILURE:
      draft.readAlertLoading = false
      draft.readAlertError = action.error

      break
    default:
      break
  }
})

export default reducer