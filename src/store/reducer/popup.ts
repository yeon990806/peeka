import produce from 'immer';

import { PopupStateType } from '@/common/defines/Store';
import { PopupCode } from '@/common/defines/Popup';

export const initialState: PopupStateType = {
  popupDisplay: false,
  signInPopupDisplay: false,
  popupCode: null,
  callback: null,
}

export const UPDATE_POPUP = 'UPDATE_POPUP'
export const TOGGLE_SIGN_IN_POPUP = 'TOGGLE_SIGN_IN_POPUP'

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
      const callback = action.data && "callback" in action.data ? action.data.callback : undefined
      
      draft.popupDisplay = action.data && "display" in action.data ? action.data.display : false
      draft.popupCode = action.data && "code" in action.data ? action.data.code : null

      if (draft.popupDisplay && callback) draft.callback = action.data.callback
      else if (!draft.popupDisplay && callback) draft.callback()


      draft.callback = null

      break
    case TOGGLE_SIGN_IN_POPUP:
      draft.signInPopupDisplay = !draft.signInPopupDisplay

      break
    default:
      return state
  }
})

export default reducer