import { removeCookie } from "@/common/libs/Cookie";
import { all, fork, put, takeLatest } from "redux-saga/effects";
import { TOGGLE_SIGN_IN_POPUP } from "../reducer/popup";
import { SIGN_OUT_REQUEST } from "../reducer/user";

function* callbackSignIn () {
  yield put({
    type: SIGN_OUT_REQUEST
  })
}

function* watchSignInPopup () {
  yield takeLatest(TOGGLE_SIGN_IN_POPUP, callbackSignIn)
}

export default function* popupSaga () {
  yield all([
    fork(watchSignInPopup)
  ])
}