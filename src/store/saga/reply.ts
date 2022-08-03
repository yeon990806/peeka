import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, takeLatest, throttle } from "redux-saga/effects";
import { 
  ADD_REPLY_REQUEST,
  ADD_REPLY_SUCCESS,
  ADD_REPLY_FAILURE,
  DELETE_REPLY_REQUEST,
  DELETE_REPLY_SUCCESS,
  DELETE_REPLY_FAILURE,
  FETCH_REPLY_FAILURE,
  FETCH_REPLY_REQUEST,
  FETCH_REPLY_SUCCESS,
  UPDATE_REPLY_SUCCESS,
  UPDATE_REPLY_FAILURE,
  UPDATE_REPLY_REQUEST
} from "../reducer/post";

function fetchReplyAPI (param) {
  return axios.get(`/api/public/board/reply?comment_id=${ param.commentId }&id=${ param.id }&paging_number=0&paging_size=20`, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function addReplyAPI (param) {
  const paramData = {
    post_id: param.postId,
    comment_id: param.commentId,
    contents: param.contents,
    to_member_id: param.author,
  }
  
  return axios.post('/api/board/reply', paramData, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function updateReplyAPI (param) {
  const paramData = {
    id: param.id,
    contents: param.contents,
  }

  return axios.patch('/api/board/reply', paramData, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function deleteReplyAPI (param) {
  const paramData = {
    data: {
      id: param.id,
      contents: param.contents
    },
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`,
    }
  }

  return axios.delete('/api/board/reply', paramData)
}

function* FetchReply (action) {
  try {
    const result = yield call(fetchReplyAPI, action.data)

    yield put({
      type: FETCH_REPLY_SUCCESS,
      data: {
        list: result.data,
        postId: action.data.postId,
        commentId: action.data.commentId
      }
    })
  } catch (err) {
    yield put({
      type: FETCH_REPLY_FAILURE,
      error: err
    })
  }
}

function* AddReply (action) {
  try {
    const result = yield call(addReplyAPI, action.data)

    yield put({
      type: ADD_REPLY_SUCCESS,
      data: {
        list: result.data,
        postId: action.data.postId,
        commentId: action.data.commentId,
        onSuccess: action.data.onSuccess,
      }
    })
  } catch (err) {
    const _err = err

    debugger;
    yield put({
      type: ADD_REPLY_FAILURE,
      error: err
    })
  }
}

function* UpdateReply (action) {
  try {
    const result = yield call(updateReplyAPI, action.data)

    yield put({
      type: UPDATE_REPLY_SUCCESS,
      data: {
        list: result.data,
        id: action.data.id,
        postId: action.data.postId,
        commentId: action.data.commentId,
        contents: action.data.contents,
        onSuccess: action.data.onSuccess,
      }
    })
  } catch (err) {
    yield put({
      type: UPDATE_REPLY_FAILURE,
      error: err
    })
  }
}

function* DeleteReply (action) {
  try {
    const result = yield call(deleteReplyAPI, action.data)

    yield put({
      type: DELETE_REPLY_SUCCESS,
      data: {
        list: result.data,
        postId: action.data.postId,
        commentId: action.data.commentId,
        id: action.data.id,
        onSuccess: action.data.onSuccess
      }
    })
  } catch (err) {
    yield put({
      type: DELETE_REPLY_FAILURE,
      error: err
    })
  }
}

function* watchFetchReply () {
  yield throttle(2000, FETCH_REPLY_REQUEST, FetchReply)
}

function* watchAddReply () {
  yield takeLatest(ADD_REPLY_REQUEST, AddReply)
}

function* watchUpdateReply () {
  yield takeLatest(UPDATE_REPLY_REQUEST, UpdateReply)
}

function* watchDeleteReply () {
  yield takeLatest(DELETE_REPLY_REQUEST, DeleteReply)
}

export default function* replySaga () {
  yield all([
    fork(watchFetchReply),
    fork(watchAddReply),
    fork(watchUpdateReply),
    fork(watchDeleteReply)
  ]) 
}