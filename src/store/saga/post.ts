import { DELETE_EXTRAPOST } from './../reducer/extra';
import { StorePostType } from '@/common/defines/Store';
import { DELETE_MAINPOST, UPDATE_MAINPOST } from './../reducer/post';
import { UPDATE_USERPOST, UPDATE_ALERT, DELETE_USERPOST, DELETE_ALERT, RE_ISSUE_REQUEST } from './../reducer/user';
import { APIHost } from '@/common/api';
import { CategoryType } from "@/common/defines/Category";
import { PopupCode } from '@/common/defines/Popup';
import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { TOGGLE_SIGN_IN_POPUP, UPDATE_POPUP } from '../reducer/popup';
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
import { UPDATE_EXTRAPOST } from '../reducer/extra';

function fetchPostAPI (param) {
  return axios.get(`${ APIHost }/public/board/post?id=${ param.id }&paging_number=0&paging_size=20&category_code=${ param.category_code ? param.category_code === CategoryType.전체 ? "" : param.category_code : "" }`)
}

function addPostAPI (param) {
  const f = new FormData()
  
  let dataset = {
    category_code: param.category_code,
    category: param.category,
    member_image: param.memberImage,
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
    id: param.id,
    category_code: param.category_code,
    category: param.category,
    member_image: param.memberImage,
    contents: param.contents,
    deleted_images: param.deleted_images,
  }

  for (let key in param.images) {
    if (param.images[key])
    f.append('images', param.images[key])
    else
    continue
  }
  f.append('contents', new Blob([ JSON.stringify(dataset) ], { type: 'application/json' }))

  return axios.patch(`${ APIHost }/board/post`, f, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
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

    if (err.response) {
      if (err.response.status === 401)
        yield put({
          type: RE_ISSUE_REQUEST,
        })
      else if (err.response.status === 401)
        yield put({
          type: TOGGLE_SIGN_IN_POPUP,
        })
    }
  }
}

function* UpdatePost (action) {
  try {
    const result = yield call(updatePostAPI, action.data)
    const responseData = {
      id: action.data.id,
      post: result.data,
      onSuccess: action.data.onSuccess,
    }

    if (result.status === 200) {
      yield put({
        type: UPDATE_POST_SUCCESS,
      })

      switch (action.data.postType) {
        case StorePostType.MainPost:
          yield put({
            type: UPDATE_MAINPOST,
            data: responseData,
          })

          break
        case StorePostType.ExtraPost:
          yield put({
            type: UPDATE_EXTRAPOST,
            data: responseData,
          })

          break
        case StorePostType.UserPost:
          yield put({
            type: UPDATE_USERPOST,
            data: responseData,
          })

          break
        case StorePostType.Alert:
          yield put({
            type: UPDATE_ALERT,
            data: responseData,
          })

          break
        default:
          return
      }
    }
  } catch (err) {
    yield put({
      type: UPDATE_POST_FAILURE,
      data: err
    })

    if (err.response) {
      if (err.response.data.code === 'FORBIDDEN_ACCESS')
        yield put({
          type: UPDATE_POPUP,
          code: PopupCode.FORBIDDEN_ACCESS
        })
      else if (err.response.status === 401)
        yield put({
          type: TOGGLE_SIGN_IN_POPUP,
        })
    }
  }
}

function* DeletePost (action) {
  try {
    const result = yield call(deletePostAPI, action.data) 

    if (result.status === 200) {
      yield put({
        type: DELETE_POST_SUCCESS
      })

      switch (action.data.postType) {
        case StorePostType.MainPost:
          yield put({
            type: DELETE_MAINPOST,
            data: action.data,
          })

          break
        case StorePostType.ExtraPost:
          yield put({
            type: DELETE_EXTRAPOST,
            data: action.data,
          })

          break
        case StorePostType.UserPost:
          yield put({
            type: DELETE_USERPOST,
            data: action.data,
          })

          break
        case StorePostType.Alert:
          yield put({
            type: DELETE_ALERT,
            data: action.data,
          })

          break
        default:
          return
      }
    }

  } catch (err) {
    yield put({
      type: DELETE_POST_FAILURE,
      error: err
    })

    if (err.response) {
      if (err.response.data.code === 'FORBIDDEN_ACCESS')
        yield put({
          type: UPDATE_POPUP,
          code: PopupCode.FORBIDDEN_ACCESS
        })
      else if (err.response.status === 401)
        yield put({
          type: TOGGLE_SIGN_IN_POPUP,
        })
    }
  }
}

function* watchFetchingPost () {
  yield takeLatest(FETCH_POST_REQUEST, FetchPost)
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