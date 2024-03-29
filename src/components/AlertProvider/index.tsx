import { PopupCode } from '@/common/defines/Popup'
import { StateType } from '@/common/defines/Store'
import { closePopup, TOGGLE_SIGN_IN_POPUP } from '@/store/reducer/popup'
import { useDispatch, useSelector } from 'react-redux'
import Popup from '../Popup'

const AlertProvider = () => {
  const dispatch = useDispatch()
  const popupDisplay = useSelector((state: StateType) => state.popup.popupDisplay)
  const popupCode = useSelector((state: StateType) => state.popup.popupCode)

  const AlertContent = () => {
    switch (popupCode) {
      case PopupCode.DUPLICATION_ERROR:
        return "이메일 또는 닉네임이 중복되었습니다."
      case PopupCode.NOT_FOUND:
        return "일치하는 사용자 정보가 없습니다."
      case PopupCode.FORBIDDEN_ACCESS:
        return "입력하신 정보를 다시 한번 확인 부탁드릴게요!"
      case PopupCode.STATE_CONFLICT:
        return "이미 실행한 액션입니다."
      case PopupCode.CATEGORY_NULL:
        return "포스트 카테고리를 선택해주세요!"
      case PopupCode.COMPLETE:
        return "완료되었습니다."
      case PopupCode.SEND_TEMP_PW_SUCCESS:
        return "임시 비밀번호가 이메일로 전송되었습니다!"
      case PopupCode.UNKNOWN:
        return "죄송해요.\n잠시 후 다시 이용 부탁드립니다..."
      case PopupCode.REPORT_SUCCESS:
        return "컨텐츠 신고가 접수되었습니다."
      case PopupCode.REQUEST_SIGN_IN:
        return `로그인 유효기간이 만료되었습니다.\n다시 로그인 부탁드릴게요!`
    }
  }

  return (
    <Popup
      display={ popupDisplay }
      type={'alert'}
      buttonAlign={'right'}
      content={ AlertContent() }
      onClick={ () => {
        dispatch(closePopup())
        
        if (popupCode === PopupCode.REQUEST_SIGN_IN)
          dispatch({
            type: TOGGLE_SIGN_IN_POPUP
          })
      } }
    />
  )
}

export default AlertProvider