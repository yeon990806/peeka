import { ExtraStateType } from '@/common/defines/Store';
import produce from 'immer';
export const initialState: ExtraStateType = {
  extraList: [],
}

export const EMPTY_LIST_REQUEST = 'EMPTY_LIST_REQUEST'

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    default:
      return state
  }
})

export default reducer