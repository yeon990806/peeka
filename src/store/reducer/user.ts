import produce from "immer"

import { UserType } from "@/common/defines/Store"
import { setCookie, removeCookie } from "@/common/libs/Cookie"

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
  clippingPostLoading: false,
  clippingPostSuccess: false,
  clippingPostError: false,
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
  },
  userPost: [],
  clippingPost: []
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
export const RESET_USER_POST = 'RESET_USER_POST'

export const CLIPPING_POST_REQUEST = 'CLIPPING_POST_REQUEST'
export const CLIPPING_POST_SUCCESS = 'CLIPPING_POST_SUCCESS'
export const CLIPPING_POST_FAILURE = 'CLIPPING_POST_FAILURE'
export const RESET_CLIPPING_POST = 'RESET_CLIPPING_POST'

export const FETCH_ALERT_REQUEST = 'FETCH_ALERT_REQUEST'
export const FETCH_ALERT_SUCCESS = 'FETCH_ALERT_SUCCESS'
export const FETCH_ALERT_FAILURE = 'FETCH_ALERT_FAILURE'

export const READ_ALERT_REQUEST = 'READ_ALERT_REQUEST'
export const READ_ALERT_SUCCESS = 'FETCH_ALERT_SUCCESS'
export const READ_ALERT_FAILURE = 'FETCH_ALERT_FAILURE'

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME'
export const DELETE_POST_TO_ME = 'DELETE_POST_TO_ME'

export const SET_SIGN_UP_PARAMETER = 'SET_SIGN_UP_PARAMETER'

export const dispatchAlwaysSignIn = () => ({
  type: TOGGLE_ALWAYS_SIGN_IN
})

export const dispatchSignIn = (data) => ({
  type: SIGN_IN_REQUEST,
  data,
})

export const dispatchSignUp = (data) => ({
  type: SIGN_UP_REQUEST,
  data,
})

export const dispatchSignOut = () => ({
    type: SIGN_OUT_REQUEST,
})

export const dispatchSignUpParameter = (data) => ({
  type: SET_SIGN_UP_PARAMETER,
  data
})

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
    case SIGN_UP_SUCCESS:
      draft.signUpLoading = false
      draft.signUpSuccess = true

      draft.userInfo = {
        id: action.data.id,
        nickname: action.data.nickname,
        grant_type: action.data.grant_type,
        alertList: [],
      }

      break
    case SIGN_UP_FAILURE:
      draft.signUpLoading = false
      draft.signUpError = action.error

      break  
    case SIGN_OUT_REQUEST:
      draft.signOutLoading = false
      draft.signOutSuccess = false
      draft.signOutError = null

      draft.userInfo = {
        id: null,
        nickname: '',
        alertList: [],
      }

      removeCookie('accessToken')
      removeCookie('refreshToken')

      break
    case SIGN_OUT_SUCCESS:
      draft.signOutLoading = false
      draft.signOutSuccess = true
      draft.userInfo = null

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
      draft.userPost = action.data.concat(draft.userPost)

      break
    case USER_POST_FAILURE:
      draft.userPostLoading = false
      draft.userPostError = action.error

      break
    case FETCH_ALERT_REQUEST:
      draft.fetchAlertLoading = true
      draft.fetchAlertSuccess = false
      draft.fetchAlertError = null

      break
    case FETCH_ALERT_SUCCESS:
      draft.fetchAlertLoading = false
      draft.fetchAlertSuccess = true
      draft.userInfo.alertList = action.data

      break
    case FETCH_ALERT_FAILURE:
      draft.fetchAlertLoading = false
      draft.fetchAlertError = action.error

      break
    default:
      break
  }
})

export default reducer