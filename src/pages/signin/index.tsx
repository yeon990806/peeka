import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import { SIGN_IN_REQUEST, TOGGLE_ALWAYS_SIGN_IN } from '@/store/reducer/user';
import { useCallback } from 'react';
import { StateType } from '@/common/defines/Store';

import Link from 'next/link'
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import Checkbox from '@/components/Checkbox';
import GoogleButton from '@/components/GoogleButton';

import style from './style.module.scss'
import Loader from '@/components/Loader';
import classNames from 'classnames';

interface SignInProps {
  popup?: boolean
}

let isPopup

const SignIn = (props: SignInProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const rememberUser = useSelector((state: StateType) => state.user.alwaysSignIn)
  const signInLoading = useSelector((state: StateType) => state.user.signInLoading)
  const [inputEmail, setInputEmail] = useState<string>(''); // 이메일 주소
  const [inputPassword, setInputPassword] = useState<string>(''); // 비밀번호
  const [validateError, setValidateError] = useState<boolean>(false); // 유효성 체크 에러 여부


  const requestSignIn = useCallback(() => {
    if ((inputEmail.length > 0 && !validateError) && inputPassword.length > 0)
      dispatch({
        type: SIGN_IN_REQUEST,
        data: {
          email: inputEmail, 
          password: inputPassword
        }
      })
  }, [inputEmail, inputPassword])

  const onToggleRememberUser = () => {
    dispatch({
      type: TOGGLE_ALWAYS_SIGN_IN,
    })
  }

  useEffect(() => {
    if (props.popup) isPopup = true
  }, [props.popup])

  return (
    <div className={  classNames(style.SignInContainer, props.popup && style.SignInPopup) }>
      <div className={ style.SignIn }>
        <Link href="/community">
          <a className={ style.Logo }>Peeka</a>
        </Link>
        <div className={ style.SignInForm }>
          <Input
            value={ inputEmail }
            onInput={ (v) => { setInputEmail(v) } }
            placeholder="이메일"
            inputmode="email"
            validate={[
              (v: string) => {
                const validEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/

                return v.match(validEmail) !== null ? { state: true, msg: "" } : { state: false, msg: "올바른 이메일 형식이 아닙니다." }
              }
             ]}
            onError={ (v) => setValidateError(v) }
            onEnter={() => requestSignIn()}
          />
          <Input
            value={ inputPassword }
            onInput={ (v) => setInputPassword(v) }
            type="password"
            placeholder="비밀번호"
            togglePassword
            inputmode="text"
            onEnter={() => requestSignIn()}
          />
          <Button
            type="action"
            theme="primary"
            disabled={ validateError || inputPassword.length === 0 || inputEmail.length === 0 }
            onClick={ () => requestSignIn() }
            additionalClass={ style.SignInButton }
            block
          >
            { signInLoading ? <Loader small inline /> : '로그인' } 
          </Button>
          <div className={ style.SignInOption }>
            <Checkbox
              id="remember"
              value={ rememberUser }
              onClick={ () => onToggleRememberUser() }
              label="로그인 유지"
            />
            <Button type="text" theme="light">
              <Link href="/recovery">
                <a>아이디/비밀번호 찾기</a>
              </Link>
            </Button>
          </div>
          <p className={ style.SignInText }>
            또는
          </p>
          <GoogleButton type="signIn" />
        </div>
      </div>
      <div className={ style.NewMember }>
        회원이 아니신가요?
        <Button type="text" theme="primary">
          <Link href="/signup">
            <a>가입하기</a>
          </Link>
        </Button>
      </div>
    </div>
  )
}

SignIn.getLayout = 1

export default SignIn