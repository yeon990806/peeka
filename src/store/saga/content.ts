import { FETCH_CREATOR_REQUEST, FETCH_CREATOR_FAILURE, FETCH_CREATOR_SUCCESS, FETCH_VIDEO_FAILURE, FETCH_VIDEO_REQUEST, FETCH_VIDEO_SUCCESS } from './../reducer/content';
import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { APIHost } from '@/common/api';

function fetchCreatorAPI (param) {
  return axios.get(`${ APIHost }/public/creator/news?category_code=${ param.category || '' }&id=${ param.id }&paging_number=0&paging_size=10`, {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`
    }
  })
}

function fetchVideoAPI (param) {
  return axios.get(`${ APIHost }/public/banners?category_code=${ param.category || '' }&id=${ param.id }&paging_number=0&paging_size=3`, {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`
    }
  })
}

function* FetchCreator (action) {
  try {
    const result = yield call(fetchCreatorAPI, action.data)

    yield put({
      type: FETCH_CREATOR_SUCCESS,
      data: {
        list: result.data,
        id: action.data.id
      }
    })
  } catch (err) {
    yield put({
      type: FETCH_CREATOR_FAILURE,
      error: err
    })
  }
}

function* FetchVideo (action) {
  try {
    const result = yield call(fetchVideoAPI, action.data)

    yield put({
      type: FETCH_VIDEO_SUCCESS,
      data: {
        list: result.data,
        category: action.data.category,
        id: action.data.id
      }
    })
  } catch (err) {
    yield put({
      type: FETCH_VIDEO_FAILURE,
      error: err
    })
  }
}

function* watchFetchCreator () {
  yield takeLatest(FETCH_CREATOR_REQUEST, FetchCreator)
}

function* watchFetchVideo () {
  yield takeLatest(FETCH_VIDEO_REQUEST, FetchVideo)
}

export default function* contentSaga () {
  yield all([
    fork(watchFetchCreator),
    fork(watchFetchVideo)
  ])
}