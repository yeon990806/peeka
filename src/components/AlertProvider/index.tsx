import { PopupCode } from '@/common/defines/Popup'
import { StateType } from '@/common/defines/Store'
import { closePopup } from '@/store/reducer/popup'
import { useDispatch, useSelector } from 'react-redux'
import Popup from '../Popup'

import style from './style.module.scss'

const AlertProvider = () => {
  const popupDisplay = useSelector((state: StateType) => state.popup.popupDisplay)
  const popupCode = useSelector((state: StateType) => state.popup.popupCode)

  const AlertContent = () => {
    switch (popupCode) {
      case PopupCode.DUPLICATION_ERROR:
        return "이메일 또는 닉네임이 중복되었습니다."
      case PopupCode.NOT_FOUND:
        return "일치하는 유저 정보가 없습니다."
      case PopupCode.NOT_FOUND:
        return "권한이 없습니다."
      case PopupCode.STATE_CONFLICT:
        return "이미 실행한 액션입니다."
    }
  }

  return (
    <Popup
      display={ popupDisplay }
      type={'alert'}
      buttonAlign={'right'}
      content={ AlertContent() }
      onClick={ closePopup }
    />
  )
}

export default AlertProvider