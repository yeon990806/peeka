import axios from "axios";
import { TOGGLE_LIKE_MAINPOST, TOGGLE_SCRAP_MAINPOST } from './../reducer/post';
import { TOGGLE_LIKE_SUCCESS, TOGGLE_LIKE_FAILURE, TOGGLE_LIKE_REQUEST, TOGGLE_SCRAP_REQUEST, TOGGLE_SCRAP_FAILURE, TOGGLE_SCRAP_SUCCESS } from './../reducer/reaction';
import {RE_ISSUE_REQUEST, TOGGLE_LIKE_ALERT, TOGGLE_LIKE_USERPOST, TOGGLE_SCRAP_ALERT, TOGGLE_SCRAP_USERPOST } from './../reducer/user';
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { StorePostType } from '@/common/defines/Store';
import { getCookie } from '@/common/libs/Cookie';
import { APIHost } from '@/common/api';
import { TOGGLE_LIKE_EXTRAPOST, TOGGLE_SCRAP_EXTRAPOST } from "../reducer/extra";
import { UPDATE_POPUP } from "../reducer/popup";
import { PopupCode } from "@/common/defines/Popup";

function toggleLikePostAPI (param) {
  debugger
  const data = {
    contents_type: param.type,
    post_id: param.postId,
    comment_id: param.commentId || null,
    reply_id: (typeof param.replyId === "string" ? Number(param.replyId.replace('_', '')) : param.replyId) || null,
  }

  return axios.post(`${ APIHost }/board/contents/like`, data , {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function toggleScrapPostAPI (param) {
  const data = {
    post_id: param.id
  }

  return axios.post(`${ APIHost }/board/post/scrap`, data, {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`,
    }
  })
}

function* toggleLikePost (action) {
  try {
    const result = yield call(toggleLikePostAPI, action.data)

    const param = {
      ...action.data,
      like: result.data.like_yn
    }

    if (result.status === 200) {
      yield put({
        type: TOGGLE_LIKE_SUCCESS
      })

      switch (action.data.postType) {
        case StorePostType.MainPost:
          yield put({
            type: TOGGLE_LIKE_MAINPOST,
            data: param
          })
          
          break
        case StorePostType.UserPost:
          yield put({
            type: TOGGLE_LIKE_USERPOST,
            data: param
          })

          break
        case StorePostType.ExtraPost:
          yield put({
            type: TOGGLE_LIKE_EXTRAPOST,
            data: param
          })

          break
        case StorePostType.Alert:
          yield put({
            type: TOGGLE_LIKE_ALERT,
            data: param
          })

          break
        default:
          return
      }
    }

  } catch (err) {
    yield put({
      type: TOGGLE_LIKE_FAILURE,
      error: err,
    })
    const _err = err

    if (err.response && err.response.status === 401) {
      yield put({
        type: RE_ISSUE_REQUEST,
      })
    } else {
      yield put({
        type: UPDATE_POPUP,
        code: PopupCode.UNKNOWN
      })
    }
  }
}

function* toggleScrapPost (action) {
  try {
    const result = yield call(toggleScrapPostAPI, action.data)

    const param = {
      ...action.data,
      scrap: result.data.scrap_yn
    }

    if (result.status === 200)
      yield put({
        type: TOGGLE_SCRAP_SUCCESS,
        data: param,
      })

      switch (action.data.postType) {
        case StorePostType.MainPost:
          yield put({
            type: TOGGLE_SCRAP_MAINPOST,
            data: param,
          })

          break
        case StorePostType.UserPost:
          yield put({
            type: TOGGLE_SCRAP_USERPOST,
            data: param,
          })

          break
        case StorePostType.ExtraPost:
          yield put({
            type: TOGGLE_SCRAP_EXTRAPOST,
            data: param,
          })

          break
        case StorePostType.Alert:
          yield put({
            type: TOGGLE_SCRAP_ALERT,
            data: param,
          })
  
          break
        default:
          return
      }
  } catch (err) {
    yield put({
      type: TOGGLE_SCRAP_FAILURE,
      error: err
    })

    if (err.response && err.response.status === 401) {
      yield put({
        type: RE_ISSUE_REQUEST,
      })
    } else {
      yield put({
        type: UPDATE_POPUP,
        code: PopupCode.UNKNOWN
      })
    }
  }
}

function* watchToggleLikePost () {
  yield takeLatest(TOGGLE_LIKE_REQUEST, toggleLikePost)
}

function* watchToggleScrapPost () {
  yield takeLatest(TOGGLE_SCRAP_REQUEST, toggleScrapPost)
}

export default function* reactionSaga () {
  yield all([
    fork(watchToggleLikePost),
    fork(watchToggleScrapPost),
  ])
}