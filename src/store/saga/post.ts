import { APIHost } from '@/common/api';
import { CategoryType } from "@/common/defines/Category";
import { PopupCode } from '@/common/defines/Popup';
import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, takeLatest, throttle } from "redux-saga/effects";
import { UPDATE_POPUP } from '../reducer/popup';
import {
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  CHANGE_POST_CATEGORY,
  DELETE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  FETCH_POST_FAILURE,
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
} from "../reducer/post";

function fetchPostAPI (param) {
  return axios.get(`${ APIHost }/public/board/post?id=${ param.id }&paging_number=0&paging_size=20&category_code=${ param.category_code ? param.category_code === CategoryType.전체 ? "" : param.category_code : "" }`)
}

function addPostAPI (param) {
  const f = new FormData()
  
  let dataset = {
    category_code: param.category_code,
    category: param.category,
    contents: param.contents
  }

  for (let key in param.images) {
    if (param.images[key])
      f.append('images', param.images[key])
    else
      continue
  }
  f.append('contents', new Blob([ JSON.stringify(dataset) ], { type: 'application/json' }))

  return axios.post(`${ APIHost }/board/post`, f, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function updatePostAPI (param) {
  const f = new FormData()
  
  let dataset = {
    category_code: param.category_code,
    category: param.category,
    contents: param.contents
  }

  for (let key in param.images) {
    if (param.images[key])
      f.append('images', param.images[key])
    else
      continue
  }
  f.append('contents', new Blob([ JSON.stringify(dataset) ], { type: 'application/json' }))


  const options = {
    data: dataset,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  }

  return axios.patch(`${ APIHost }/board/post`, f)
}

function deletePostAPI (param) {
  const options = {
    data: {
      id: param
    },
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  }
  
  return axios.delete(`${ APIHost }/board/post`, options)
}

function* FetchPost (action) {
  try {
    const result = yield call(fetchPostAPI, action.data)

    yield put({
      type: FETCH_POST_SUCCESS,
      data: {
        post: result.data,
        initPost: action.data.initPost,
      }
    })
  } catch (err) {
    yield put({
      type: FETCH_POST_FAILURE,
      data: `${ err.response.status }: ${ err.response.statusText }`
    })
  }
}

function* AddPost (action) {
  try {
    const result = yield call(addPostAPI, action.data)

    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    })

    yield put({
      type: CHANGE_POST_CATEGORY,
      data: CategoryType[action.data.category]
    })
    
    if (action.data.onSuccess) action.data.onSuccess()
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err,
    })
  }
}

function* UpdatePost (action) {
  try {
    const result = yield call(updatePostAPI, action.data)

    if (result.status === 200)
      yield put({
        type: UPDATE_POST_SUCCESS,
        data: {
          post: action.data,
          onSuccess: action.data.onSuccess,
        }
      })
  } catch (err) {
    yield put({
      type: UPDATE_POST_FAILURE,
      data: err
    })
    if (err.response.data.code === 'FORBIDDEN_ACCESS')
      yield put({
        type: UPDATE_POPUP,
        code: PopupCode.FORBIDDEN_ACCESS
      })
  }
}

function* DeletePost (action) {
  try {
    const result = yield call(deletePostAPI, action.data) 

    if (result.status === 200)
      yield put({
        type: DELETE_POST_SUCCESS,
        data: action.data
      })
  } catch (err) {
    yield put({
      type: DELETE_POST_FAILURE,
      error: err
    })
    if (err.response.data.code === 'FORBIDDEN_ACCESS')
      yield put({
        type: UPDATE_POPUP,
        code: PopupCode.FORBIDDEN_ACCESS
      })
  }
}

function* watchFetchingPost () {
  yield throttle(5000, FETCH_POST_REQUEST, FetchPost)
}

function* watchCreatePost () {
  yield takeLatest(ADD_POST_REQUEST, AddPost)
}

function* watchUpdatePost () {
  yield takeLatest(UPDATE_POST_REQUEST, UpdatePost)
}

function* watchDeletePost () {
  yield takeLatest(DELETE_POST_REQUEST, DeletePost)
}

export default function* postSaga () {
  yield all([
    fork(watchFetchingPost),
    fork(watchCreatePost),
    fork(watchUpdatePost),
    fork(watchDeletePost),
  ])
}