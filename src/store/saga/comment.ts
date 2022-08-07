import { FETCH_USERPOST_COMMENT } from './../reducer/user';
import axios from "axios"
import { getCookie } from "@/common/libs/Cookie"
import { all, call, fork, put, takeLatest, throttle } from "redux-saga/effects"
import {
  FETCH_COMMENT_REQUEST,
  FETCH_COMMENT_SUCCESS,
  FETCH_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  UPDATE_COMMENT_FAILURE,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_COMMENT_REQUEST,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
} from "../reducer/comment"
import { UPDATE_USERPOST_COMMENT } from "../reducer/user"
import { ADD_POST_COMMENT, FETCH_POST_COMMENT } from "../reducer/post"
import { StorePostType } from '@/common/defines/Store';
import { addCommentAction } from '@/common/defines/Action';

function fetchCommentAPI (param) {
  return axios.get(`/api/public/board/comment?post_id=${ param.postId }&id=${ param.id }&paging_number=0&paging_size=10`, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function addCommentAPI (param) {
  return axios.post('/api/board/comment', {
    post_id: param.postId,
    contents: param.contents,
    to_member_id: param.author
  }, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function updateCommentAPI (param) {
  return axios.patch('/api/board/comment', {
    id: param.id,
    contents: param.contents
  }, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function deleteCommentAPI (param) {
  return axios.delete('/api/board/comment', {
    data: param,
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function* FetchComment (action) {
  try {
    const result = yield call(fetchCommentAPI, action.data)

    yield put({
      type: FETCH_COMMENT_SUCCESS,
    })

    switch (action.data.postType) {
      case StorePostType.MainPost:
        yield put({
          type: FETCH_POST_COMMENT,
          data: {
            list: result.data,
            id: action.data.postId,
          }
        })

        break
      case StorePostType.UserPost:
        yield put({
          type: FETCH_USERPOST_COMMENT,
          data: {
            list: result.data,
            id: action.data.postId,
          },
        })
        
        break
      case StorePostType.ExtraPost:
        // yield put({})
        break
      default:
        break
    }

  } catch (err) { 
    yield put({
      type: FETCH_COMMENT_FAILURE,
      data: err.response.data,
    })
  }
}

function* AddComment (action) {
  try {
    const result = yield call(addCommentAPI, action.data)
    const data = {
      list: result.data,
      id: action.data.postId,
      onSuccess: action.data.onSuccess
    }

    yield put({
      type: ADD_COMMENT_SUCCESS,
    })

    debugger

    switch (action.data.postType) {
      case StorePostType.MainPost:
        yield put({
          type: ADD_POST_COMMENT,
          data,
        })

        break
      case StorePostType.UserPost:
        break
      case StorePostType.ExtraPost:
        break
      default:
        break
    }
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: err
    })
  }
}

function* UpdateComment (action) {
  try {
    const result = yield call(updateCommentAPI, action.data)

    yield put({
      type: UPDATE_COMMENT_SUCCESS,
      data: {
        id: action.data.id,
        postId: action.data.postId,
        contents: action.data.contents,
      }
    })
  } catch (err) {
    yield put({
      type: UPDATE_COMMENT_FAILURE,
      data: err.response.data
    })
  }
}

function* DeleteComment (action) {
  try {
    const result = yield call(deleteCommentAPI, { id: action.data.id })

    yield put({
      type: DELETE_COMMENT_SUCCESS,
      data: action.data
    })
  } catch (err) {
    yield put({
      type: DELETE_COMMENT_FAILURE,
      data: err.response.data
    })
  }
}

function* watchFetchComment () {
  yield throttle(2000, FETCH_COMMENT_REQUEST, FetchComment)
}

function* watchAddComment () {
  yield takeLatest(ADD_COMMENT_REQUEST, AddComment)
}

function* watchUpdateComment () {
  yield takeLatest(UPDATE_COMMENT_REQUEST, UpdateComment)
}

function* watchDeleteComent () {
  yield takeLatest(DELETE_COMMENT_REQUEST, DeleteComment)
}

export default function* commentSaga () {
  yield all([
    fork(watchFetchComment),
    fork(watchAddComment),
    fork(watchUpdateComment),
    fork(watchDeleteComent)
  ])
}