import produce from "immer"

import { UserType } from "@/common/defines/Store"
import { setCookie, removeCookie } from "@/common/libs/Cookie"
import { fetchCommentAction, addCommentAction, updateCommentAction, deleteCommentAction, fetchReplyAction, addReplyAction, updateReplyAction, deleteReplyAction, deletePostAction, updatePostAction, toggleLikeContentAction, toggleScrapContentAction } from "@/common/defines/Action"
import Router from "next/router"

export const initialState: UserType = {
  alwaysSignIn: false,
  fetchUserInfoLoading: false,
  fetchUserInfoSuccess: false,
  fetchUserInfoError: null,
  reIssueLoading: false,
  reIssueSuccess: false,
  reIssueError: null,
  fetchDone: false,
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
  userPostInfo: {
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
}

export const TOGGLE_ALWAYS_SIGN_IN = 'ALWAYS_SIGN_IN_REQUEST'
export const UPDATE_USERINFO = 'UPDATE_USERINFO'

export const FETCH_USERINFO_REQUEST = 'FETCH_USERINFO_REQUEST'
export const FETCH_USERINFO_SUCCESS = 'FETCH_USERINFO_SUCCESS'
export const FETCH_USERINFO_FAILURE = 'FETCH_USERINFO_FAILURE'

export const RE_ISSUE_REQUEST = 'RE_ISSUE_REQUEST'
export const RE_ISSUE_SUCCESS = 'RE_ISSUE_SUCCESS'
export const RE_ISSUE_FAILURE = 'RE_ISSUE_FAILURE'

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST'
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS'
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE'

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST'
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS'
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

export const UPDATE_USERPOST = 'UPDATE_USERPOST'
export const DELETE_USERPOST = 'DELETE_USERPOST'

export const FETCH_USERPOST_COMMENT = 'FETCH_USERPOST_COMMENT'
export const ADD_USERPOST_COMMENT = 'ADD_USERPOST_COMMENT'
export const UPDATE_USERPOST_COMMENT = 'UPDATE_USERPOST_COMMENT'
export const DELETE_USERPOST_COMMENT = 'DELETE_USERPOST_COMMENT'

export const FETCH_USERPOST_COMMENT_REPLY = 'FETCH_USERPOST_COMMENT_REPLY'
export const ADD_USERPOST_COMMENT_REPLY = 'ADD_USERPOST_COMMENT_REPLY'
export const UPDATE_USERPOST_COMMENT_REPLY = 'UPDATE_USERPOST_COMMENT_REPLY'
export const DELETE_USERPOST_COMMENT_REPLY = 'DELETE_USERPOST_COMMENT_REPLY'

export const RESET_USER_POST = 'RESET_USER_POST'

export const TOGGLE_LIKE_USERPOST = 'TOGGLE_LIKE_USERPOST'
export const TOGGLE_SCRAP_USERPOST = 'TOGGLE_SCRAP_USERPOST'

export const FETCH_ALERT_REQUEST = 'FETCH_ALERT_REQUEST'
export const FETCH_ALERT_SUCCESS = 'FETCH_ALERT_SUCCESS'
export const FETCH_ALERT_FAILURE = 'FETCH_ALERT_FAILURE'

export const UPDATE_ALERT = 'UPDATE_ALERT'
export const DELETE_ALERT = 'DELETE_ALERT'

export const FETCH_ALERT_COMMENT = 'FETCH_ALERT_COMMENT'
export const ADD_ALERT_COMMENT = 'ADD_ALERT_COMMENT'
export const UPDATE_ALERT_COMMENT = 'UPDATE_ALERT_COMMENT'
export const DELETE_ALERT_COMMENT = 'DELETE_ALERT_COMMENT'

export const FETCH_ALERT_COMMENT_REPLY = 'FETCH_ALERT_COMMENT_REPLY'
export const ADD_ALERT_COMMENT_REPLY = 'ADD_ALERT_COMMENT_REPLY'
export const UPDATE_ALERT_COMMENT_REPLY = 'UPDATE_ALERT_COMMENT_REPLY'
export const DELETE_ALERT_COMMENT_REPLY = 'DELETE_ALERT_COMMENT_REPLY'

export const READ_ALERT_REQUEST = 'READ_ALERT_REQUEST'
export const READ_ALERT_SUCCESS = 'READ_ALERT_SUCCESS'
export const READ_ALERT_FAILURE = 'READ_ALERT_FAILURE'

export const TOGGLE_LIKE_ALERT = 'TOGGLE_LIKE_ALERT'
export const TOGGLE_SCRAP_ALERT = 'TOGGLE_SCRAP_ALERT'

export const SET_SIGN_UP_PARAMETER = 'SET_SIGN_UP_PARAMETER'

export const getReIssueLoading = (state) => state.reIssueLoading

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

      setCookie('userInfo', action.data)
      
      break
    case FETCH_USERINFO_FAILURE:

      draft.fetchUserInfoLoading = false
      draft.fetchUserInfoError = action.error

      if (action.callback) action.callback()

      break
    case RE_ISSUE_REQUEST:
      draft.reIssueLoading = true
      draft.reIssueSuccess = false
      draft.reIssueError = null

      break
    case RE_ISSUE_SUCCESS:
      draft.reIssueLoading = false
      draft.reIssueSuccess = true

      setCookie('accessToken', action.data.access_token, { 
        path: '/',
        secure: true,
        expires: new Date(Date.now() + (6 * 3600 * 1000)),
      })
      setCookie('refreshToken', action.data.refresh_token, {
        path: '/',
        secure: true,
      })

      break
    case RE_ISSUE_FAILURE:
      draft.reIssueLoading = false
      draft.reIssueError = action.error

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
        nickname: action.data.nickname,
        grant_type: action.data.grant_type,
        alertList: [],
        alertDetail: null,
      }

      draft.signUpLoading = false
      draft.signUpSuccess = true

      draft.userInfo = userInfo

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

      if (draft.userPost.length === 0) draft.fetchDone = false

      break
    case USER_POST_SUCCESS:
      draft.userPostLoading = false
      draft.userPostSuccess = true

      if (action.data.posts.length > 0) {
        const _post = draft.userPost.findIndex(v => v.id === action.data.posts[0].id)

        if (_post >= 0) return
      }

      if (action.data.length === 0) draft.fetchDone = true

      draft.userPost = [ ...draft.userPost, ...action.data.posts ]
      draft.userPostInfo = action.data.member

      break
    case USER_POST_FAILURE:
      draft.userPostLoading = false
      draft.userPostError = action.error

      break
    case UPDATE_USERPOST:
      updatePostAction(action.data, draft.userPost, action.data.onSuccess)

      break
    case DELETE_USERPOST:
      const arr = deletePostAction(action.data.postId, draft.userPost)

      draft.userPost = arr

      break
    case RESET_USER_POST:
      draft.userPost = []
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
    case TOGGLE_LIKE_USERPOST:
      toggleLikeContentAction({ ...action.data }, draft.userPost)

      break
    case TOGGLE_SCRAP_USERPOST:
      toggleScrapContentAction({ ...action.data }, draft.userPost)

      break
    case FETCH_ALERT_REQUEST:
      draft.fetchAlertLoading = true
      draft.fetchAlertSuccess = false
      draft.fetchAlertError = null

      break
    case FETCH_ALERT_SUCCESS:
      draft.fetchAlertLoading = false
      draft.fetchAlertSuccess = true
      
      if (draft.userInfo.alertList && draft.userInfo.alertList.length > 0) {
        if (action.data.list.length > 0) {
          const alert = draft.userInfo.alertList.findIndex(v => v.id === action.data.list[0].id)
  
          if (alert >= 0) return
        }

        if (action.data.init) {
          draft.userInfo.alertList = action.data.list
        } else {
          draft.userInfo.alertList = action.data.list.concat(draft.userInfo.alertList)
        }
      }
      else 
        draft.userInfo.alertList = action.data.list
      
      break
    case FETCH_ALERT_FAILURE:
      draft.fetchAlertLoading = false
      draft.fetchAlertError = action.error

      break
    case UPDATE_ALERT:
      updatePostAction(action.data, draft.userInfo.alertDetail, action.data.onSuccess)

      break
    case DELETE_ALERT: {
      const arr = deletePostAction(action.data.postId, draft.userInfo.alertDetail, action.data.onnSuccess)
      
      draft.userInfo.alertDetail = arr

      break
    }
    case FETCH_ALERT_COMMENT:
      fetchCommentAction({ ...action.data }, draft.userInfo.alertDetail)

      break
    case ADD_ALERT_COMMENT:
      addCommentAction({ ...action.data }, draft.userInfo.alertDetail, action.data.onSuccess)

      break
    case UPDATE_ALERT_COMMENT:
      updateCommentAction({ ...action.data }, draft.userInfo.alertDetail, action.data.onSuccess)

      break
    case DELETE_ALERT_COMMENT:
      deleteCommentAction({ ...action.data }, draft.userInfo.alertDetail, action.data.onSuccess)

      break
    case FETCH_ALERT_COMMENT_REPLY:
      fetchReplyAction({ ...action.data }, draft.userInfo.alertDetail)

      break
    case ADD_ALERT_COMMENT_REPLY:
      addReplyAction({ ...action.data }, draft.userInfo.alertDetail, action.data.onSuccess)

      break
    case UPDATE_ALERT_COMMENT_REPLY:
      updateReplyAction({ ...action.data }, draft.userInfo.alertDetail, action.data.onSuccess)

      break
    case DELETE_ALERT_COMMENT_REPLY:
      deleteReplyAction({ ...action.data }, draft.userInfo.alertDetail, action.data.onSuccess)

      break
    case TOGGLE_LIKE_ALERT:
      toggleLikeContentAction({ ...action.data }, draft.userInfo.alertDetail)

      break
    case TOGGLE_SCRAP_ALERT:
      toggleScrapContentAction({ ...action.data }, draft.userInfo.alertDetail)

      break
    case READ_ALERT_REQUEST:
      draft.readAlertLoading = true
      draft.readAlertSuccess = false
      draft.readAlertError = null

      draft.userInfo.alertDetail = []

      break
    case READ_ALERT_SUCCESS: {
      const post = action.data.post.post
      const alert = draft.userInfo.alertList.find(v => v.id === action.data.alertId)
      
      draft.readAlertLoading = false
      draft.readAlertSuccess = true

      post.comment_list = action.data.post.comments

      if (action.data.post.replies)
        action.data.post.replies.map((r) => {
          const comment = post.comment_list.find(v => v.id === r.comment_id)

          if (comment) {
            if ('reply_list' in comment) comment.reply_list.push(r)
            else {
              comment.reply_list = [ r ]
            }
          }
        })
      
      alert.check_yn = 'Y'
      draft.userInfo.alertDetail.push(post)
      
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