import { all, fork } from "redux-saga/effects"
import postSaga from "./post"
import userSaga from "./user"
import commentSaga from "./comment"
import replySaga from "./reply"

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(postSaga),
    fork(commentSaga),
    fork(replySaga)
  ])
}