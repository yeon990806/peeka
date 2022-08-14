import { PopupCode } from '@/common/defines/Popup'
import { StateType } from '@/common/defines/Store'
import { closePopup } from '@/store/reducer/popup'
import { useDispatch, useSelector } from 'react-redux'
import Popup from '../Popup'

import style from './style.module.scss'

const AlertProvider = () => {
  const dispatch = useDispatch()
  const popupDisplay = useSelector((state: StateType) => state.popup.popupDisplay)
  const popupCode = useSelector((state: StateType) => state.popup.popupCode)

  const AlertContent = () => {
    switch (popupCode) {
      case PopupCode.DUPLICATION_ERROR:
        return "이메일 또는 닉네임이 중복되었습니다."
      case PopupCode.NOT_FOUND:
        return "일치하는 유저 정보가 없습니다."
      case PopupCode.FORBIDDEN_ACCESS:
        return "권한이 없습니다."
      case PopupCode.STATE_CONFLICT:
        return "이미 실행한 액션입니다."
      case PopupCode.CATEGORY_NULL:
        return "포스트 카테고리를 정해주세요."
      case PopupCode.COMPLETE:
        return "완료되었습니다."
      case PopupCode.SEND_TEMP_PW_SUCCESS:
        return "임시 비밀번호가 입력하신 이메일로 전송되었습니다."
      case PopupCode.UNKNOWN:
        return "잠시 후에 다시 시도해주세요."
      case PopupCode.REPORT_SUCCESS:
        return "게시물을 신고했습니다."
    }
  }

  return (
    <Popup
      display={ popupDisplay }
      type={'alert'}
      buttonAlign={'right'}
      content={ AlertContent() }
      onClick={ () => dispatch(closePopup()) }
    />
  )
}

export default AlertProvider