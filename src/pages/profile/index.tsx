import { StateType } from '@/common/defines/Store';
import List from '@/components/List';
import Popup from '@/components/Popup';
import UserProfile from '@/components/UserProfile';
import Router from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ChangePasswordPopup from './components/ChangePasswordPopup';
import WithDrawPopup from './components/WithdrawPopup';

import style from "./style.module.scss"

const profile = () => {
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const [userImage, setUserImage] = useState<string>('')
  const [displayWithdrawPopup, setDisplayWithdrawPopup] = useState<boolean>(false)
  const [displayPasswordPopup, setDisplayPasswordPopup] = useState<boolean>(false)
  const [displayCngPwdPopup, setDisplayCngPwdPopup] = useState<boolean>(false)

  const toggleWithdrawDisplay = useCallback((v?: boolean) => {
    if (v) toggleCngPwdDisplay()
    setDisplayWithdrawPopup(prev => !prev)
  }, [displayWithdrawPopup])
  const togglePasswordDisplay = useCallback(() => setDisplayPasswordPopup(prev => !prev), [displayPasswordPopup])
  const toggleCngPwdDisplay = useCallback(() => setDisplayCngPwdPopup(prev => !prev), [displayCngPwdPopup])

  useEffect(() => {
    if (!userInfo.id) Router.push('/community')

    try {
      if (userInfo && userInfo.image) {
        setUserImage(userInfo.image.hasOwnProperty('uploadedFileURL') && userInfo.image.uploadedFileURL)
      }
    } catch (err) {
      setUserImage('')
    }
  }, [userInfo])

  if (!userInfo) return Router.push('/community')

  return (
    <>
      <WithDrawPopup
        display={ displayWithdrawPopup }
        onPrev={ () => toggleWithdrawDisplay() }
      />
      <ChangePasswordPopup
        display={ displayPasswordPopup }
        onPrev={ () => togglePasswordDisplay() }
      />
      <Popup
        display={ displayCngPwdPopup }
        content="비밀번호를 성공적으로 변경했습니다."
        type="alert"
        buttonAlign="right"
        onClick={ () => toggleCngPwdDisplay() }
      />
      <div className={ style.Profile }>
        <div className={ style.ProfileImageContainer }>
          <UserProfile
            size="xl"
            profileImage={ userImage || "" }
            changeImage
          />
          <div className={ style.Username }>
            { userInfo.nickname.replaceAll('@', '') }
          </div>
        </div>
        <List
          additionalClass={ style.ProfileList }
          variant="gray"
        >
          <li onClick={ () => togglePasswordDisplay() }>비밀번호 변경</li>
          <li onClick={ () => toggleWithdrawDisplay() }>
            회원탈퇴
          </li>
        </List>
      </div>
    </>
  )
}

export default profile