import { FETCH_CURATOR_FAILURE, FETCH_CURATOR_REQUEST, FETCH_VIDEO_FAILURE, FETCH_VIDEO_REQUEST, FETCH_VIDEO_SUCCESS } from './../reducer/content';
import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, throttle } from "redux-saga/effects";
import { FETCH_CURATOR_SUCCESS } from "../reducer/content";
import { APIHost } from '@/common/api';

function fetchCuratorAPI (param) {
  return axios.get(`${ APIHost }/public/curator/news?category_code=${ param.category }&id=${ param.id }&paging_number=0&paging_size=10`, {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`
    }
  })
}

function fetchVideoAPI (param) {
  return axios.get(`${ APIHost }/public/banners?category_code=${ param.category }&id=${ param.id }&paging_number=0&paging_size=3`, {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`
    }
  })
}

function* FetchCurator (action) {
  try {
    const result = yield call(fetchCuratorAPI, action.data)

    yield put({
      type: FETCH_CURATOR_SUCCESS,
      data: {
        list: result.data,
        id: action.data.id
      }
    })
  } catch (err) {
    yield put({
      type: FETCH_CURATOR_FAILURE,
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

function* watchFetchCurator () {
  yield throttle(2000, FETCH_CURATOR_REQUEST, FetchCurator)
}

function* watchFetchVideo () {
  yield throttle(2000, FETCH_VIDEO_REQUEST, FetchVideo)
}

export default function* contentSaga () {
  yield all([
    fork(watchFetchCurator),
    fork(watchFetchVideo)
  ])
}