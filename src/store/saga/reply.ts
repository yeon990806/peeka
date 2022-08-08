import { UPDATE_USERPOST_COMMENT_REPLY, DELETE_USERPOST_COMMENT_REPLY } from './../reducer/user';
import { ADD_POST_COMMENT_REPLY, UPDATE_POST_COMMENT_REPLY, DELETE_POST_COMMENT_REPLY } from './../reducer/post';
import { StorePostType } from "@/common/defines/Store";
import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, takeLatest, throttle } from "redux-saga/effects";
import { ADD_EXTRAPOST_COMMENT_REPLY, DELETE_EXTRAPOST_COMMENT_REPLY, FETCH_EXTRAPOST_COMMENT_REPLY, UPDATE_EXTRAPOST_COMMENT_REPLY } from "../reducer/extra";
import { FETCH_POST_COMMENT_REPLY } from "../reducer/post";
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
} from "../reducer/reply";
import { ADD_USERPOST_COMMENT_REPLY, FETCH_USERPOST_COMMENT_REPLY } from "../reducer/user";
import { APIHost } from '@/common/api';

function fetchReplyAPI (param) {
  return axios.get(`${ APIHost }/public/board/reply?comment_id=${ param.commentId }&id=${ param.id }&paging_number=0&paging_size=20`, {
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
  
  return axios.post(`${ APIHost }/board/reply`, paramData, {
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

  return axios.patch(`${ APIHost }/board/reply`, paramData, {
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

  return axios.delete(`${ APIHost }/board/reply`, paramData)
}

function* FetchReply (action) {
  try {
    const result = yield call(fetchReplyAPI, action.data)
    const data = {
      list: result.data,
      postId: action.data.postId,
      commentId: action.data.commentId,
      id: action.data.id,
    }

    yield put({
      type: FETCH_REPLY_SUCCESS,
    })

    switch (action.data.postType) {
      case StorePostType.MainPost:
        yield put({
          type: FETCH_POST_COMMENT_REPLY,
          data,
        })

        break
      case StorePostType.UserPost:
        yield put({
          type: FETCH_USERPOST_COMMENT_REPLY,
          data,
        })

        break
      case StorePostType.ExtraPost:
        yield put({
          type: FETCH_EXTRAPOST_COMMENT_REPLY,
          data,
        })
        
        break
      default:
        return
    }
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
    const data = {
      list: result.data,
      postId: action.data.postId,
      commentId: action.data.commentId,
      onSuccess: action.data.onSuccess,
    }

    yield put({
      type: ADD_REPLY_SUCCESS,
    })

    switch (action.data.postType) {
      case StorePostType.MainPost:
        yield put({
          type: ADD_POST_COMMENT_REPLY,
          data,
        })
        
        break
      case StorePostType.UserPost:
        yield put({
          type: ADD_USERPOST_COMMENT_REPLY,
          data,
        })
      case StorePostType.ExtraPost:
        yield put({
          type: ADD_EXTRAPOST_COMMENT_REPLY,
          data,
        })
      default:
        return
    }
  } catch (err) {
    yield put({
      type: ADD_REPLY_FAILURE,
      error: err
    })
  }
}

function* UpdateReply (action) {
  try {
    const result = yield call(updateReplyAPI, action.data)
    const data = {
      list: result.data,
      id: action.data.id,
      commentId: action.data.commentId,
      postId: action.data.postId,
      contents: action.data.contents,
      onSuccess: action.data.onSuccess,
    }

    yield put({
      type: UPDATE_REPLY_SUCCESS,
    })

    switch (action.data.postType) {
      case StorePostType.MainPost:
        yield put({
          type: UPDATE_POST_COMMENT_REPLY,
          data,
        })
        
        break
      case StorePostType.UserPost:
        yield put({
          type: UPDATE_USERPOST_COMMENT_REPLY,
          data,
        })
        
        break
      case StorePostType.ExtraPost:
        yield put({
          type: UPDATE_EXTRAPOST_COMMENT_REPLY,
          data,
        })
        
        break
      default:
        return
    }
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
    const data = {
      list: result.data,
      postId: action.data.postId,
      commentId: action.data.commentId,
      id: action.data.id,
      onSuccess: action.data.onSuccess
    }

    yield put({
      type: DELETE_REPLY_SUCCESS,
    })

    switch (action.data.postType) {
      case StorePostType.MainPost:
        yield put({
          type: DELETE_POST_COMMENT_REPLY,
          data,
        })

        break
      case StorePostType.UserPost:
        yield put({
          type: DELETE_USERPOST_COMMENT_REPLY,
          data,
        })

        break
      case StorePostType.ExtraPost:
        yield put({
          type: DELETE_EXTRAPOST_COMMENT_REPLY,
          data,
        })

        break
      default:
        return
    }
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