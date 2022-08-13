import produce from 'immer';

import { PopupStateType } from '@/common/defines/Store';
import { PopupCode } from '@/common/defines/Popup';
import { useDispatch } from 'react-redux';

export const initialState: PopupStateType = {
  popupDisplay: false,
  popupCode: null,
  callback: null,
}

export const UPDATE_POPUP = 'UPDATE_POPUP'

export const openPopup = (code: PopupCode, callback?) => ({
  type: UPDATE_POPUP,
  data: {
    display: true,
    code,
    callback
  }
})

export const closePopup = () => ({
  type: UPDATE_POPUP,
  data: {
    display: false,
    code: null,
  }
})

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case UPDATE_POPUP:
      draft.popupDisplay = action.data.display
      draft.popupCode = action.data.code

      if (action.data.display && action.data.callback) draft.callback = action.data.callback
      else if (!action.data.display && action.data.callback) draft.callback()


      draft.callback = null

      break
    default:
      return state
  }
})

export default reducer