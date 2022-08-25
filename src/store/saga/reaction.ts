import {LIKE_ALERT, RE_ISSUE_REQUEST, SCRAP_ALERT, UNLIKE_ALERT, UNSCRAP_ALERT } from './../reducer/user';
import { LIKE_CONTENT_SUCCESS, LIKE_CONTENT_FAILURE, UNLIKE_CONTENT_SUCCESS, UNLIKE_CONTENT_FAILURE, SCRAP_CONTENT_SUCCESS, SCRAP_CONTENT_FAILURE, UNSCRAP_CONTENT_SUCCESS, UNSCRAP_CONTENT_FAILURE } from './../reducer/reaction';
import axios from "axios";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { LIKE_CONTENT_REQUEST, SCRAP_CONTENT_REQUEST, UNLIKE_CONTENT_REQUEST, UNSCRAP_CONTENT_REQUEST } from "../reducer/reaction";
import { StorePostType } from '@/common/defines/Store';
import { LIKE_MAINPOST_CONTENT, SCRAP_MAINPOST, UNLIKE_MAINPOST_CONTENT, UNSCRAP_MAINPOST } from '../reducer/post';
import { LIKE_USERPOST_CONTENT, SCRAP_USERPOST, UNLIKE_USERPOST_CONTENT, UNSCRAP_USERPOST } from '../reducer/user';
import { LIKE_EXTRAPOST_CONTENT, SCRAP_EXTRAPOST, UNLIKE_EXTRAPOST_CONTENT, UNSCRAP_EXTRAPOST } from '../reducer/extra';
import { getCookie } from '@/common/libs/Cookie';
import { APIHost } from '@/common/api';
import { UPDATE_POPUP } from '../reducer/popup';
import { PopupCode } from '@/common/defines/Popup';

function likePostAPI (param) {
  const data = {
    contents_type: param.type,
    post_id: param.postId,
    comment_id: param.commentId || null,
    reply_id: param.replyId || null,
  }

  return axios.post(`${ APIHost }/board/contents/like`, data , {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function unlikePostAPI (param) {
  const data = {
    contents_type: param.type,
    post_id: param.postId,
    comment_id: param.commentId || null,
    reply_id: param.replyId || null,
  }
  const options = {
    data,
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`,
    }
  }
  
  return axios.delete(`${ APIHost }/board/contents/like`, options)
}

function scrapPostAPI (param) {
  const data = {
    post_id: param.id
  }

  return axios.post(`${ APIHost }/board/post/scrap`, data, {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function unscrapPostAPI (param) {
  const data = {
    post_id: param.id
  }
  const options = {
    data,
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`,
    }
  }

  return axios.delete(`${ APIHost }/board/post/scrap`, options)
}

function* LikePost (action) {
  try {
    const result = yield call(likePostAPI, action.data)

    if (result.status === 200) {
      yield put({
        type: LIKE_CONTENT_SUCCESS
      })

      switch (action.data.postType) {
        case StorePostType.MainPost:
          yield put({
            type: LIKE_MAINPOST_CONTENT,
            data: action.data
          })
          
          break
        case StorePostType.UserPost:
          yield put({
            type: LIKE_USERPOST_CONTENT,
            data: action.data
          })

          break
        case StorePostType.ExtraPost:
          yield put({
            type: LIKE_EXTRAPOST_CONTENT,
            data: action.data,
          })

          break
        case StorePostType.Alert:
          yield put({
            type: LIKE_ALERT,
            data: action.data,
          })

          break
        default:
          return
      }
    }

  } catch (err) {
    yield put({
      type: LIKE_CONTENT_FAILURE,
      error: err,
    })

    if (err.response) {
      if (err.response.data.code === 'STATE_CONFLICT')
        yield put({
          type: UPDATE_POPUP,
          code: PopupCode.STATE_CONFLICT
        })
      else if (err.response.status === 401)
        yield put({
          type: RE_ISSUE_REQUEST,
        })
    }
  }
}

function* UnlikePost (action) {
  try {
    const result = yield call(unlikePostAPI, action.data)

    yield put({
      type: UNLIKE_CONTENT_SUCCESS,
      data: action.data
    })

    switch (action.data.postType) {
      case StorePostType.MainPost:
        yield put({
          type: UNLIKE_MAINPOST_CONTENT,
          data: action.data
        })

        break
      case StorePostType.UserPost:
        yield put({
          type: UNLIKE_USERPOST_CONTENT,
          data: action.data
        })

        break
      case StorePostType.ExtraPost:
        yield put({
          type: UNLIKE_EXTRAPOST_CONTENT,
          data: action.data
        })

        break
      case StorePostType.Alert:
        yield put({
          type: UNLIKE_ALERT,
          data: action.data,
        })

        break
      default:
        return
    }
  } catch (err) {
    yield put({
      type: UNLIKE_CONTENT_FAILURE,
      error: err.response.data,
    })

    if (err.response) {
      if (err.response.data.code === 'STATE_CONFLICT')
        yield put({
          type: UPDATE_POPUP,
          code: PopupCode.STATE_CONFLICT
        })
      else if (err.response.status === 401)
        yield put({
          type: RE_ISSUE_REQUEST,
        })
    }
  }
}

function* ScrapPost (action) {
  try {
    const result = yield call(scrapPostAPI, action.data)

    if (result.status === 200)
      yield put({
        type: SCRAP_CONTENT_SUCCESS,
        data: action.data,
      })

      switch (action.data.postType) {
        case StorePostType.MainPost:
          yield put({
            type: SCRAP_MAINPOST,
            data: action.data,
          })

          break
        case StorePostType.UserPost:
          yield put({
            type: SCRAP_USERPOST,
            data: action.data
          })

          break
        case StorePostType.ExtraPost:
          yield put({
            type: SCRAP_EXTRAPOST,
            data: action.data
          })

          break
        case StorePostType.Alert:
          yield put({
            type: SCRAP_ALERT,
            data: action.data,
          })
  
          break
        default:
          return
      }
  } catch (err) {
    yield put({
      type: SCRAP_CONTENT_FAILURE,
      error: err
    })

    if (err.response) {
      if (err.response.data.code === 'STATE_CONFLICT')
        yield put({
          type: UPDATE_POPUP,
          code: PopupCode.STATE_CONFLICT
        })
  
      else if (err.response.status === 401)
        yield put({
          type: RE_ISSUE_REQUEST,
        })
    }
  }
}

function* UnscrapPost (action) {
  try {
    const result = yield call(unscrapPostAPI, action.data)

    if (result.status === 200)
      yield put({
        type: UNSCRAP_CONTENT_SUCCESS,
        data: action.data,
      })

      switch (action.data.postType) {
        case StorePostType.MainPost:
          yield put({
            type: UNSCRAP_MAINPOST,
            data: action.data,
          })

          break
        case StorePostType.UserPost:
          yield put({
            type: UNSCRAP_USERPOST,
            data: action.data,
          })

          break
        case StorePostType.ExtraPost:
          yield put({
            type: UNSCRAP_EXTRAPOST,
            data: action.data
          })

          break
        case StorePostType.Alert:
        yield put({
          type: UNSCRAP_ALERT,
          data: action.data,
        })

        break
        default:
          return
      }
  } catch (err) {
    yield put({
      type: UNSCRAP_CONTENT_FAILURE,
      error: err
    })

    if (err.response) {
      if (err.response.data.code === 'STATE_CONFLICT')
        yield put({
          type: UPDATE_POPUP,
          code: PopupCode.STATE_CONFLICT
        })
      else if (err.response.status === 401)
        yield put({
          type: RE_ISSUE_REQUEST,
        })
    }
  }
}


function* watchLikePost () {
  yield takeLatest(LIKE_CONTENT_REQUEST, LikePost)
}

function* watchUnlikePost () {
  yield takeLatest(UNLIKE_CONTENT_REQUEST, UnlikePost)
}

function* watchScrapPost () {
  yield takeLatest(SCRAP_CONTENT_REQUEST, ScrapPost)
}

function* watchUnscrapPost () {
  yield takeLatest(UNSCRAP_CONTENT_REQUEST, UnscrapPost)
}

export default function* reactionSaga () {
  yield all([
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchScrapPost),
    fork(watchUnscrapPost)
  ])
}