import { APIHost } from "@/common/api"
import { getCookie } from "@/common/libs/Cookie"
import Input from "@/components/Input"
import Popup from "@/components/Popup"
import axios from "axios"
import { useCallback, useState } from "react"
import { useSelector } from "react-redux"
import { StateType } from "@/common/defines/Store";

import style from "./style.module.scss"

interface ChangePasswordPopupProps {
  display: boolean
  onPrev: (v?: boolean) => void
}

const ChangePasswordPopup = (props: ChangePasswordPopupProps) => {
  const userEmail = useSelector((state: StateType) => state.user.userInfo.email)
  const [legacyPassword, setLegacyPassword] = useState<string>('')
  const [inputPassword, setInputPassword] = useState<string>('')
  const [confirmLegacy, setConfirmLegacy] = useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false)
  const [onError, setOnError] = useState<string>('')

  const onChangeLegacyPassword = useCallback((v: string) => setLegacyPassword(v), [legacyPassword])
  const onChangePassword = useCallback((v: string) => setInputPassword(v), [inputPassword])
  const onChangeError = useCallback((v: string) => setOnError(v), [onError])
  const onClose = (v?: boolean) => {
    onChangeLegacyPassword('')
    onChangePassword('')
    onChangeError('')
    setConfirmLegacy(false)
    setConfirmPassword(false)

    return props.onPrev(v)
  }
  const onConfirmChangePassword = useCallback(async () => {
    const formData = {
      email: userEmail,
      password: legacyPassword,
      new_password: inputPassword
    }

    try {
      const result = await axios.patch(`${ APIHost }/member/password`, formData, {
        headers: {
          Authorization: `Bearer ${ getCookie('accessToken') }`
        }
      })

      if (result.status === 200) {
        onChangeError('')
        
        onClose(true)
      }
      else onChangeError('기존 비밀번호가 틀립니다. 다시 확인해주세요.')
    } catch (err) {
      onChangeError('비밀번호 변경을 다시 시도해주세요.')
    }
  }, [legacyPassword, inputPassword])

  if (!props.display) return

  return (
    <Popup
      display={ props.display }
      type="confirm"
      buttonAlign="right"
      content={
        <>
          <Input
            value={ legacyPassword }
            type="password"
            togglePassword
            placeholder="기존 비밀번호"
            onInput={ (v) => onChangeLegacyPassword(v) }
            />
          <Input
            value={ inputPassword }
            type="password"
            togglePassword
            placeholder="비밀번호"
            description="비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 모두 포함하어야 합니다."
            validate={[
              (v: string) => {
                const validPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/

                if (v.match(validPassword) !== null) {
                  setConfirmPassword(true)

                  return { state: true, msg: '' }
                } else {
                  setConfirmPassword(false)

                  return { state: false, msg: "비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 모두 포함하어야 합니다." } 
                }
              },
            ]}
            onInput={ (v) => onChangePassword(v) }
            />
            { onError && <div className={ style.OnError }>
              { onError }
            </div> }
        </>
      }
      onCancel={ () => onClose() }
      onClick={ () => onConfirmChangePassword() }
      confirmDisable={ !confirmLegacy && !confirmPassword }
    />
  )
}

export default ChangePasswordPopup