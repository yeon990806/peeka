import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { LayoutType } from '../_app'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Link from 'next/link'
import axios from 'axios'

import style from './style.module.scss'
import { APIHost } from '@/common/api'
import { openPopup } from '@/store/reducer/popup'
import { PopupCode } from '@/common/defines/Popup'
import { useDispatch } from 'react-redux'
import { getCookie } from '@/common/libs/Cookie'

const Recover = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [inputEmail, setInputEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<boolean>(false)

  const onChangeInputEmail = useCallback((v: string) => setInputEmail(v), [inputEmail])
  const onChangeEmailError = useCallback((v: boolean) => setEmailError(v), [emailError])
  
  const onPrevClickHandler = () => { router.replace('/signin') }
  const onRecover = async () => {
    try {
      const data = {
        email: inputEmail
      }
      const result = await axios.patch(`${ APIHost }/public/auth/password`, data, {
        headers: {
          Authorization: `Bearer ${ getCookie('accessToken') }`,
        }
      })

      if (result.status === 200) {
        dispatch(openPopup(PopupCode.SEND_TEMP_PW_SUCCESS, router.push('/signin')))
      } else {
        dispatch(openPopup(PopupCode.NOT_FOUND))
      }
    } catch (err) {
      dispatch(openPopup(PopupCode.UNKNOWN))
    }
  }

  return (
    <div className={ style.RecoverContainer }>
        <header>
          <Button type="icon" onClick={ () => onPrevClickHandler() }>
            <img src="/images/prev.svg" tabIndex={-1} alt="previous page" />
          </Button>
        <div className={ style.RecoverTitle }>
          비밀번호 찾기
        </div>
      </header>
      <div className={ style.RecoverContent }>
        <Input
          value={ inputEmail }
          onInput={ (v) => onChangeInputEmail(v) }
          placeholder="복구를 위한 이메일을 입력해주세요."
          inputmode="email"
          validate={[
            (v: string) => {
              const validEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/

              return v.match(validEmail) !== null ? { state: true, msg: "" } : { state: false, msg: "올바른 이메일 형식이 아닙니다." }
            }
           ]}
          onError={ (v) => onChangeEmailError(v) }
          onEnter={ () => onRecover() }
        />
        <Button
          type="action"
          theme="primary"
          disabled={ emailError || inputEmail.length === 0 }
          additionalClass={ style.SubmitButton }
          onClick={ () => onRecover() }
          block
        >
          임시 비밀번호 발송
        </Button>
        <div className={ style.RecoverAction }>
          <div className={ style.Action }>
            <p>
              회원이 아니라면
            </p>
            <Button
              type="text"
              theme="primary"
              additionalClass={ style.SignUp }
            >
              <Link href="/signup">
                <a>회원가입</a>
              </Link>
            </Button>
          </div>
        </div>
        <Button
          type="text"
          theme="light-gray"
          block
        >
          <Link href="/signin">
            <a>뒤로 가기</a>
          </Link>
        </Button>
      </div>
    </div>
  )
}

Recover.getLayout = LayoutType.Sign

export default Recover