import { getCookie } from "@/common/libs/Cookie";
import axios from "axios";
import { all, call, fork, put, throttle } from "redux-saga/effects";
import { FETCH_EXTRAPOST_FAILURE, FETCH_EXTRAPOST_REQUEST, FETCH_EXTRAPOST_SUCCESS } from "../reducer/extra";

function fetchExtraPostAPI (param) {
  let api = `/api/${ param.public ? 'public/' : '' }board/post`
  const option = `id=${ param.id }&paging_number=0&paging_size=20`
  
  switch (param.type) {
    case 'member':
      api = api + `/member?member_id=${ param.memberId }&` + option
      
      break
    case 'scrap':
      api = api + '/scrap?' + option

      break
    case 'search':
      api = api + `/search?category_code=${ param.category }&search_contents=${ param.text }&` + option

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

function* FetchExtraPost (action) {
  try {
    const result = yield call(fetchExtraPostAPI, action.data)

    yield put({
      type: FETCH_EXTRAPOST_SUCCESS,
      data: {
        list: result.data,
      }
    })
  } catch (err) {
    yield put({
      type: FETCH_EXTRAPOST_FAILURE,
      data: err
    })
  }

}

function* watchFetchingExtraPost () {
  yield throttle(5000, FETCH_EXTRAPOST_REQUEST, FetchExtraPost)
}

export default function* extraSaga () {
  yield all([
    fork(watchFetchingExtraPost)
  ])
}