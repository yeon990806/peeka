import { RE_ISSUE_FAILURE, RE_ISSUE_REQUEST, RE_ISSUE_SUCCESS } from './../reducer/user';
import { APIHost } from '@/common/api';
import { PopupCode } from '@/common/defines/Popup';
import { userType } from '@/common/defines/Signup';
import axios from 'axios';
import router from 'next/router';
import { all, call, debounce, fork, put, select, takeLatest, throttle } from 'redux-saga/effects'
import { getCookie, removeCookie, setCookie } from '../../common/libs/Cookie';
import { openPopup, TOGGLE_SIGN_IN_POPUP, UPDATE_POPUP } from '../reducer/popup';
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
import { EMPTY_MAIN_POST } from '../reducer/post';

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
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
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
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

export async function onSilentRefresh () {
  const access = getCookie('accessToken') || ""
  const refresh = getCookie('refreshToken') || ""

  return axios.post(`${ APIHost }/public/auth/reissue`, {
    access_token: access,
    refresh_token: refresh,
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
    if (err.response && err.response.status === 401)
      yield put({
        type: RE_ISSUE_REQUEST,
      })
    else {
      yield put({
        type: UPDATE_POPUP,
        code: PopupCode.UNKNOWN
      })
    }
  }
}

function* ReIssueAction (action) {
  try {
    if (!getCookie('accessToken') || !getCookie('refreshToken')) {
      return yield put({
        type: TOGGLE_SIGN_IN_POPUP
      })
    }

    const result = yield call(onSilentRefresh)
    
    if (result && result.status === 200) {
      yield put({
        type: RE_ISSUE_SUCCESS,
        data: result.data
      })
    } else {
      yield put({
        type: UPDATE_POPUP,
        data: {
          display: true,
          code: PopupCode.REQUEST_SIGN_IN
        }
      })
    }
  } catch (err) {
    const _err = err
    if (err.response && err.response.data.code === 'UNABLE_REFRESH') {
      removeCookie('refreshToken')
      removeCookie('accessToken')
      removeCookie('userInfo')

      yield put({
        type: UPDATE_POPUP,
        data: {
          display: true,
          code: PopupCode.REQUEST_SIGN_IN
        }
      })
    } else {
      yield put({
        type: UPDATE_POPUP,
        data: {
          display: true,
          code: PopupCode.SIGN_IN
        }
      })
    }


    yield put({
      type: RE_ISSUE_FAILURE,
      error: err,
    })
  }
}

function* SignIn (action) {
  try {
    const result = yield call(signInAPI, action.data)

    if (result.status === 200) {
      if (action.alwaysSignIn) setTimeout(onSilentRefresh, JWT_EXPIRY_TIME - 60000)
      yield put({
        type: SIGN_IN_SUCCESS,
        data: result.data
      })
  
      yield put({
        type: FETCH_USERINFO_REQUEST
      })

      if (action.data.popup) {
        return yield put({
          type: TOGGLE_SIGN_IN_POPUP
        })
      } else {
        return router.push('/community')
      }
    } else {
      yield put({
        type: SIGN_IN_FAILURE,
        error: result
      })
    }

  } catch (err) {
    yield put({
      type: SIGN_IN_FAILURE,
      error: err
    })

    if (err.response && err.response.data.code === 'NOT_FOUND')
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
    yield put({
      type: EMPTY_MAIN_POST,
    })

    
    if (window.location.pathname.indexOf('community') > -1) {
      location.reload()
    } else {
      yield router.push('/community')
    }
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
      data: err,
    })

    if (err.response && err.response.status === 401)
      yield put({
        type: RE_ISSUE_REQUEST,
      })
    else {
      yield put({
        type: UPDATE_POPUP,
        code: PopupCode.UNKNOWN
      })
    }
  }
}

function* FetchAlert (action) {
  try {
    const result = yield call(fetchAlertAPI, action.data)

    yield put({
      type: FETCH_ALERT_SUCCESS,
      data: {
        init: action.data.init,
        list: result.data
      }
    })
  } catch (err) {
    yield put({
      type: FETCH_ALERT_FAILURE,
      data: err
    })

    if (err.response && err.response.status === 401)
      yield put({
        type: RE_ISSUE_REQUEST,
      })
    else
      yield put({
        type: UPDATE_POPUP,
        code: PopupCode.UNKNOWN
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

    if (err.response && err.response.status === 401)
      yield put({
        type: RE_ISSUE_REQUEST,
      })
    else
      yield put({
        type: UPDATE_POPUP,
        code: PopupCode.UNKNOWN
      })
  }
}

function* watchFetchUserInfo () {
  yield takeLatest(FETCH_USERINFO_REQUEST, FetchUserInfo)
}

function* watchReIssue () {
  yield debounce(100, RE_ISSUE_REQUEST, ReIssueAction)
}

function* watchSignIn () {
  yield takeLatest(SIGN_IN_REQUEST, SignIn)
}

function* watchSignUp () {
  yield takeLatest(SIGN_UP_REQUEST, SignUp)
}

function* watchSignOut () {
  yield takeLatest(SIGN_OUT_REQUEST, SignOut)
}

function* watchUserPost () {
  yield takeLatest(USER_POST_REQUEST, FetchUserPost)
}

function* watchFetchAlert () {
  yield takeLatest(FETCH_ALERT_REQUEST, FetchAlert)
}

function* watchReadAlert () {
  yield takeLatest(READ_ALERT_REQUEST, ReadAlert)
}

export default function* userSaga () {
  yield all([
    fork(watchFetchUserInfo),
    fork(watchReIssue),
    fork(watchSignIn),
    fork(watchSignUp),
    fork(watchSignOut),
    fork(watchUserPost),
    fork(watchFetchAlert),
    fork(watchReadAlert)
  ])
}