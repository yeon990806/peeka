import { APIHost } from "@/common/api";
import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { FETCH_EXTRAPOST_FAILURE, FETCH_EXTRAPOST_REQUEST, FETCH_EXTRAPOST_SUCCESS, FETCH_LINKEDPOST_FAILURE, FETCH_LINKEDPOST_REQUEST, FETCH_LINKEDPOST_SUCCESS } from "../reducer/extra";

function FetchExtraPostAPI (param) {
  let api = `${ APIHost }/${ param.public ? 'public/' : '' }board/post`
  const option = `id=${ param.id }&paging_number=0&paging_size=20`
  
  switch (param.type) {
    case 'member':
      api = api + `/member?member_id=${ param.memberId }&` + option
      
      break
    case 'scrap':
      api = api + '/scrap?' + option

      break
    case 'search':
      api = api + `/search?search_contents=${ param.text }&` + option

      break
    case 'tag':
      api = api + `/search/tag?category_code=&search_tag=%23${ param.tag }&` + option

      break
    default:
      return
  }

  return axios.get(api, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`
    }
  })
}

function FetchLinkedPostAPI (param) {
  return axios.get(`${ APIHost }/public/board/contents?post_id=${ param.id }&comment_id=&reply_id=`, {
    headers: {
      'Authorization': `Bearer ${ getCookie('accessToken') }`
    }
  })
}

function* FetchExtraPost (action) {
  try {
    const result = yield call(FetchExtraPostAPI, action.data)

    yield put({
      type: FETCH_EXTRAPOST_SUCCESS,
      data: result.data,
    })
  } catch (err) {
    yield put({
      type: FETCH_EXTRAPOST_FAILURE,
      data: err
    })
  }
}

function* FetchLinkedPost (action) {
  try {
    const result = yield call(FetchLinkedPostAPI, action.data)

    yield put({
      type: FETCH_LINKEDPOST_SUCCESS,
      data: result.data,
    })
  } catch (err) {
    yield put({
      type: FETCH_LINKEDPOST_FAILURE,
      data: err
    })
  }
}

function* watchFetchingExtraPost () {
  yield takeLatest(FETCH_EXTRAPOST_REQUEST, FetchExtraPost)
}

function* watchFetchingLinkedPost () {
  yield takeLatest(FETCH_LINKEDPOST_REQUEST, FetchLinkedPost)
}

export default function* extraSaga () {
  yield all([
    fork(watchFetchingExtraPost),
    fork(watchFetchingLinkedPost),
  ])
}