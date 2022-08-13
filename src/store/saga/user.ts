import { APIHost } from '@/common/api';
import { PopupCode } from '@/common/defines/Popup';
import { userType } from '@/common/defines/Signup';
import axios from 'axios';
import router from 'next/router';
import { all, call, fork, put, throttle, delay, takeLatest } from 'redux-saga/effects'
import { getCookie, setCookie } from '../../common/libs/Cookie';
import { openPopup, UPDATE_POPUP } from '../reducer/popup';
import { 
  FETCH_USERINFO_REQUEST,
  FETCH_USERINFO_FAILURE,
  FETCH_USERINFO_SUCCESS,
  SIGN_IN_REQUEST,
  SIGN_IN_FAILURE,
  SIGN_IN_SUCCESS,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_OUT_FAILURE,
  SIGN_OUT_REQUEST,
  SIGN_OUT_SUCCESS,
  USER_POST_REQUEST,
  USER_POST_SUCCESS,
  USER_POST_FAILURE,
  FETCH_ALERT_SUCCESS,
  FETCH_ALERT_FAILURE,
  FETCH_ALERT_REQUEST,
  READ_ALERT_REQUEST,
  READ_ALERT_SUCCESS,
  READ_ALERT_FAILURE
} from '../reducer/user'

const JWT_EXPIRY_TIME = 6 * 3600 * 1000 // 6hours

function fetchUserInfoAPI () {
  return axios.get(`${ APIHost }/member/profile`, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function signInAPI (param) {
  return axios.post(`${ APIHost }/public/auth/login`, param, {
    headers: {
      'Authorization': '',
    }
  })
}

function signUpAPI (param) {
  const parameter = {
    email: param.email,
    password: param.password,
    nickname: param.nick_name,
    birthday: param.birthday,
    gender: param.gender,
    marketing_yn: param.marketing_yn
  }
  return axios.post(`${ APIHost }/public/auth/signup${ param.signup_type === userType.google ? '/google' : '' }`, parameter, {
    headers: {
      'Authorization': '',
    }
  })
}

export function onSlientRefresh () {
  return axios.post(`${ APIHost }/public/auth/reissue`, {
    access_token: getCookie('accessToken'),
    refresh_token: getCookie('refreshToken')
  })
}

function fetchUserPostAPI (param) {
  return axios.get(`${ APIHost }/public/board/post/member?member_id=${ param.memberId }&id=${ param.postId }&paging_number=0&paging_size=20`, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function fetchAlertAPI (param) {
  return axios.get(`${ APIHost }/notice?id=${ param.id }&paging_number=0&paging_size=5`, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function readAlertAPI (param) {
  const paramData = {
    id: param.id,
    check_yn: param.check,
    contents_source: param.source,
  }
  return axios.patch(`${ APIHost }/notice`, paramData, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function* FetchUserInfo () {
  try {
    const result = yield call(fetchUserInfoAPI)

    yield put({
      type: FETCH_USERINFO_SUCCESS,
      data: result.data,
    })
  } catch (err) {
    yield put({
      type: FETCH_USERINFO_FAILURE,
      data: err
    })
  }
}

function* SignIn (action) {
  try {
    const result = yield call(signInAPI, action.data)

    if (result.status === 200) {
      if (action.alwaysSignIn) setTimeout(onSlientRefresh, JWT_EXPIRY_TIME - 60000)
      yield put({
        type: SIGN_IN_SUCCESS,
        data: result.data
      })
  
      yield put({
        type: FETCH_USERINFO_REQUEST
      })
      
      return router.push('/community')
    }

  } catch (err) {
    yield put({
      type: SIGN_IN_FAILURE,
      error: err
    })

    
    if (err.response.data.code === 'NOT_FOUND')
      yield put({
        type: UPDATE_POPUP,
        data: {
          display: true,
          code: PopupCode.NOT_FOUND
        }
      })
    else
      yield put({
        type: UPDATE_POPUP,
        data: {
          display: true,
          code: PopupCode.FORBIDDEN_ACCESS
        }
      })
  }
}

function* SignUp (action) {
  try {
    const result = yield call(signUpAPI, action.data)

    if (result.status === 200) {
      setCookie('accessToken', result.data.access_token, {
        path: '/',
        secure: true,
      })
      setCookie('refreshToken', result.data.refresh_token, {
        path: '/',
        secure: true,
      })
  
      yield put({
        type: SIGN_UP_SUCCESS,
        data: result.data,
      })
  
      yield put({
        type: FETCH_USERINFO_REQUEST,
      })
  
      return router.push('/community')
    } else {
      openPopup(PopupCode.DUPLICATION_ERROR)
    }

  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err,
    })
  }
}

function* SignOut () {
  try {
    yield put({
      type: SIGN_OUT_SUCCESS,
    })
    yield router.push('/community')
  } catch (err) {
    yield put({
      type: SIGN_OUT_FAILURE,
      data: err.response.data,
    })
  }
}

function* FetchUserPost (action) {
  try {
    const result = yield call(fetchUserPostAPI, action.data)

    yield put({
      type: USER_POST_SUCCESS,
      data: result.data,
    })
  } catch (err) {
    yield put({
      type: USER_POST_FAILURE,
      data: err.response.data,
    })
  }
}

function* FetchAlert (action) {
  try {
    const result = yield call(fetchAlertAPI, action.data)

    yield put({
      type: FETCH_ALERT_SUCCESS,
      data: result.data
    })
  } catch (err) {
    yield put({
      type: FETCH_ALERT_FAILURE,
      data: err
    })
  }
}

function* ReadAlert (action) {
  try {
    const result = yield call(readAlertAPI, action.data)

    yield put({
      type: READ_ALERT_SUCCESS,
      data: {
        post: result.data,
        alertId:action.data.id,
        onSuccess: action.data.onSuccess
      }
    })
  } catch (err) {
    yield put({
      type: READ_ALERT_FAILURE,
      error: err
    })
  }
}

function* watchFetchUserInfo () {
  yield takeLatest(FETCH_USERINFO_REQUEST, FetchUserInfo)
}

function* watchSignIn () {
  yield throttle(20000, SIGN_IN_REQUEST, SignIn)
}

function* watchSignUp () {
  yield throttle(20000, SIGN_UP_REQUEST, SignUp)
}

function* watchSignOut () {
  yield throttle(20000, SIGN_OUT_REQUEST, SignOut)
}

function* watchUserPost () {
  yield throttle(20000, USER_POST_REQUEST, FetchUserPost)
}

function* watchFetchAlert () {
  yield throttle(20000, FETCH_ALERT_REQUEST, FetchAlert)
}

function* watchReadAlert () {
  yield takeLatest(READ_ALERT_REQUEST, ReadAlert)
}

export default function* userSaga () {
  yield all([
    fork(watchFetchUserInfo),
    fork(watchSignIn),
    fork(watchSignUp),
    fork(watchSignOut),
    fork(watchUserPost),
    fork(watchFetchAlert),
    fork(watchReadAlert)
  ])
}