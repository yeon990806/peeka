import { CategoryType } from "@/common/defines/Category";
import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, takeLatest, throttle } from "redux-saga/effects";
import {
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  DELETE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  FETCH_POST_FAILURE,
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  SCRAP_POST_FAILURE,
  SCRAP_POST_REQUEST,
  SCRAP_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNSCRAP_POST_FAILURE,
  UNSCRAP_POST_REQUEST,
  UNSCRAP_POST_SUCCESS,
} from "../reducer/post";

function fetchPostAPI (param) {
  return axios.get(`/api/public/board/post?id=${ param.id }&paging_number=${ param.paging_number }&paging_size=${ param.paging_size }&category_code=${ param.category_code ? param.category_code === CategoryType.전체 ? "" : param.category_code : "" }`)
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

  return axios.post(`/api/board/post`, f, {
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
  
  return axios.delete('/api/board/post', options)
}

function likePostAPI (param) {
  const data: {
    contents_type: string
    post_id?: number
    comment_id?: number
    reply_id?: number
  } = {
    contents_type: param.type
  }

  switch (param.type) {
    case 'post':
      data.post_id = param.id
      
      break
    case 'comment':
      data.comment_id = param.id
      
      break
    case 'reply':
      data.reply_id = param.id

      break
  }

  return axios.post('/api/board/contents/like', data , {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`
    }
  })
}

function unlikePostAPI (param) {
  const data: {
      contents_type: string
      post_id?: number
      comment_id?: number
      reply_id?: number
    } = {
      contents_type: param.type
    }

    switch (param.type) {
      case 'post':
        data.post_id = param.id
        
        break
      case 'comment':
        data.comment_id = param.id
        
        break
      case 'reply':
        data.reply_id = param.id

        break
    }

  const options = {
    data,
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`
    }
  }
  
  return axios.delete('/api/board/contents/like', options)
}

function scrapPostAPI (param) {
  return axios.post('/api/board/post/scrap', {
    post_id: param.id
  }, {
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`
    }
  })
}

function unscrapPostAPI (parma) {
  return axios.delete('/api/board/post/scrap', {
    data: {
      post_id: parma.id
    },
    headers: {
      Authorization: `Bearer ${ getCookie('accessToken') }`
    }
  })
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
    
    if (action.data.submit) action.data.submit()
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      data: `${ err.response.status }: ${ err.response.statusText }`
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
      data: err.response.data
    })
  }
}

function* LikePost (action) {
  try {
    const result = yield call(likePostAPI, action.data)

    if (result.status === 200)
      yield put({
        type: LIKE_POST_SUCCESS,
        data: action.data,
      })
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      data: err.response.data,
    })
  }
}

function* UnlikePost (action) {
  try {
    const result = yield call(unlikePostAPI, action.data)

    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: action.data
    })
  } catch (err) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      data: err.response.data,
    })
  }
}

function* ScrapPost (action) {
  try {
    const result = yield call(scrapPostAPI, action.data)

    if (result.status === 200)
      yield put({
        type: SCRAP_POST_SUCCESS,
        data: action.data,
      })
  } catch (err) {
    yield put({
      type: SCRAP_POST_FAILURE,
      data: err
    })
  }
}

function* UnscrapPost (action) {
  try {
    const result = yield call(unscrapPostAPI, action.data)

    if (result.status === 200)
      yield put({
        type: UNSCRAP_POST_SUCCESS,
        data: action.data,
      })
  } catch (err) {
    yield put({
      type: UNSCRAP_POST_FAILURE,
      data: err
    })
  }
}

function* watchFetchingPost () {
  yield throttle(2000, FETCH_POST_REQUEST, FetchPost)
}

function* watchCreatePost () {
  yield takeLatest(ADD_POST_REQUEST, AddPost)
}

function* watchDeletePost () {
  yield takeLatest(DELETE_POST_REQUEST, DeletePost)
}

function* watchLikePost () {
  yield takeLatest(LIKE_POST_REQUEST, LikePost)
}

function* watchUnlikePost () {
  yield takeLatest(UNLIKE_POST_REQUEST, UnlikePost)
}

function* watchScrapPost () {
  yield takeLatest(SCRAP_POST_REQUEST, ScrapPost)
}

function* watchUnscrapPost () {
  yield takeLatest(UNSCRAP_POST_REQUEST, UnscrapPost)
}

export default function* postSaga () {
  yield all([
    fork(watchFetchingPost),
    fork(watchCreatePost),
    fork(watchDeletePost),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchScrapPost),
    fork(watchUnscrapPost)
  ])
}