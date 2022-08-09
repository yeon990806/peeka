import { StateType } from '@/common/defines/Store'
import { useDispatch, useSelector } from 'react-redux'
import Popup from '../Popup'

import style from './style.module.scss'

const AlertProvider = () => {
  const dispatch = useDispatch()
  const popupDisplay = useSelector((state: StateType) => state.popup.popupDisplay)
  const popupCode = useSelector((state: StateType) => state.popup.popupCode)

  const closePopup = () => {

  }

  return (
    <Popup
      display={false}
      type={'alert'}
      buttonAlign={'right'}
    />
  )
}

export default AlertProvider