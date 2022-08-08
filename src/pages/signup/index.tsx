import { InputStepType, SignupStepType } from "@/common/defines/Signup";
import { Mobile, Desktop, IsDesktop } from "@/common/hooks/breakpoints";
import Button from "@/components/Button";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayoutType } from "../_app";
import SignupTitle from "./components/SignupTitle";
import EmailAuth from "./containers/EmailAuth";
import InputInfo from "./containers/InputInfo";
import { genderType } from '@/common/defines/Signup';

import style from "./style.module.scss";
import axios, { AxiosResponse } from "axios";
import { SIGN_UP_REQUEST } from "@/store/reducer/user";
import { APIHost, AxiosResponseType } from "@/common/api";
import { StateType } from "@/common/defines/Store";

const SignUp = () => {
  const dispatch = useDispatch()
  const googleEmail = useSelector((state: StateType) => state.user.signupData)

  const [userId, setUserId] = useState<number | null>(null) // 이메일 인증했을 때 부여받는 유저의 아이디
  const [userEmail, setUserEmail] = useState<string>('') // 유저가 입력한 이메일
  const [sentCode, setSentCode] = useState<boolean>(false) // 인증코드 보낸 여부
  const [authCode, setAuthCode] = useState<string>('') // 유저가 입력한 인증코드
  const [username, setUsername] = useState<string>('') // 유저가 입력한 유저네임
  const [password, setPassword] = useState<string>('') // 유저가 입력한 비밀번호
  const [birthDate, setBirthDate] = useState<string>('') // 유저가 입력한 생년웧일
  const [gender, setGender] = useState<genderType | null>(null) // 유저 성별
  const [codeError, setCodeError] = useState<string>('') // 인증 코드 관련 에러

  const [agreeAll, setAgreeAll] = useState<boolean>(false) // 모두 선택
  const [overYouth, setOverYouth] = useState<boolean>(false) // 성인 여부
  const [serviceTerms, setServiceTerms] = useState<boolean>(false) // 서비스 이용약관 동의 여부
  const [privacyPolicy, setPrivacyPolicy] = useState<boolean>(false) // 개인정보처리약관 동의 여부
  const [receiveMarketing, setReceiveMarketing] = useState<boolean>(false) // 마케팅 정보 수신 동의 여부
  
  const [showing, setShowing] = useState<boolean>(false)
  const [pageStep, setPageStep] = useState<SignupStepType>(SignupStepType.EmailAuth) // 회원가입 절차
  const [enableClick, setEnableClick] = useState<boolean>(false) // 다음 버튼의 활성화 여부
  
  const footerButtonText = ["인증 확인", "다음", "가입하기"]

  const submitButtonStyle = useMemo(() => ({
    marginTop: pageStep === SignupStepType.EmailAuth ? 16 : 32
  }), [pageStep])

  const onChangeUserEmail = useCallback((data: string) => setUserEmail(data), [userEmail])
  const onChangeAuthCode = useCallback((data: string) => setAuthCode(data), [authCode])
  const onChangeUserName = useCallback((data: string) =>  setUsername(data), [username])
  const onChangePassword = useCallback((data: string) => setPassword(data), [password])
  const onChangeBirthDate = useCallback((data: string) => setBirthDate(data), [birthDate])
  const onChangeGenderType = useCallback((data: genderType) => setGender(data), [gender])
  const onChangeOverYouth = useCallback(() => setOverYouth(prev => !prev), [overYouth])
  const onChangeServiceTerms = useCallback(() => setServiceTerms(prev => !prev), [serviceTerms])
  const onChangePrivacyPolicy = useCallback(() => setPrivacyPolicy(prev => !prev), [privacyPolicy])
  const onChangeReceiveMarketing = useCallback(() => setReceiveMarketing(prev => !prev), [receiveMarketing])
  const onChangeAgreeAll = useCallback(() => {
    if (agreeAll) {
      setOverYouth(false)
      setOverYouth(false)
      setServiceTerms(false)
      setPrivacyPolicy(false)
      setReceiveMarketing(false)
    } else {
      setOverYouth(true)
      setServiceTerms(true)
      setPrivacyPolicy(true)
      setReceiveMarketing(true)
    }
  }, [agreeAll])

  const onChangePageStep = useCallback(() => setPageStep(prev => prev += 1), [pageStep])
  const onChangeCodeError = useCallback((val: string) => setCodeError(val), [codeError])
  const onChangeUserId = useCallback((id: number | any) => setUserId(id), [userId])

  const fetchAuthCode = () => {
    setSentCode(true)

    axios.post(`${ APIHost }/public/auth/email/validation/code`, {
      email: userEmail
    }).then((resp: AxiosResponseType<{
      id: number;
      code: null | number;
      status: string | null;
    }>) => {
      if (resp.status === 200) onChangeUserId(resp.data.id)
    })
  }

  const fetchValidateAuthCode = () => {
    axios.get(`/api/public/auth/email/validation/code?id=${ userId }&code=${ authCode }`)
      .then((resp: AxiosResponse<{
        id: number;
        code: number;
        statement: boolean | number;
      }>) => {
        if (resp.data.statement) {
          onChangePageStep()
          onChangeCodeError('')
        } else onChangeCodeError('인증번호를 다시 확인해주세요.')
      })
  }

  const onPrevClickHandler = () => {
    switch (pageStep) {
      case SignupStepType.EmailAuth:
        return router.push('/signin')
      case SignupStepType.InputInfo:
        return setPageStep(pageStep - 1)
    }
  }

  const onClickNextHandler = () => {
    if (pageStep === SignupStepType.EmailAuth) return fetchValidateAuthCode()

    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        email: userEmail,
        password,
        nick_name: username,
        birthday: birthDate,
        gender: genderType[gender],
        marketing_yn: receiveMarketing ? "Y" : "N",
        signup_type: "GN"
      }
    })
  }

  useEffect(() => {
    setShowing(true)
  }, [])

  useEffect(() => {
    if (googleEmail && googleEmail.email) onChangePageStep()
  }, [googleEmail])

  useEffect(() => {
    if (overYouth && serviceTerms && privacyPolicy && setReceiveMarketing) setAgreeAll(true)
    else setAgreeAll(false)
  }, [overYouth, serviceTerms, privacyPolicy, setReceiveMarketing])

  useEffect(() => {
    if (userEmail && sentCode) setEnableClick(true)
  }, [userEmail, sentCode, authCode])

  const pagecontent = () => {
    switch (pageStep) {
      case SignupStepType.EmailAuth:
        return <EmailAuth
          userEmail={ userEmail }
          setUserEmail={ (v) => onChangeUserEmail(v) }
          onClickAuthButton={ () => fetchAuthCode() }
          sentCode={ sentCode }
          authCode={ authCode }
          setAuthCode={ (v) => onChangeAuthCode(v) }
          codeError={ codeError }
        />
      case SignupStepType.InputInfo:
        return <InputInfo
          userName={ username }
          password={ password }
          birthDate={ birthDate }
          userGender={ gender }
          agreeAll={ agreeAll }
          overYouth={ overYouth }
          serviceTerms={ serviceTerms }
          privacyPolicy={ privacyPolicy }
          receiveMarketing={ receiveMarketing }
          setUserName={ (v) => onChangeUserName(v) }
          setPassword={ (v) => onChangePassword(v) }
          setBirthDate={ (v) => onChangeBirthDate(v) }
          setUserGender={ (v) => onChangeGenderType(v) }
          setAgreeAll={ () => onChangeAgreeAll() }
          setOverYouth={ () => onChangeOverYouth() }
          setServiceTerms={ () => onChangeServiceTerms() }
          setPrivacyPolicy={ () => onChangePrivacyPolicy() }
          setReceiveMarketing={ () => onChangeReceiveMarketing() }
        />
    }
  }

  if (!showing) return <></>
  return (
    <div className={ style.SignUpContainer }>
      <div className={ style.SignUp }>
        <Mobile>
          <header>
            <Button type="icon" onClick={ () => onPrevClickHandler() }>
              <img src="/images/prev.svg" tabIndex={-1} alt="previous page" />
            </Button>
            <div className={ style.SignUpTitle }>
              <SignupTitle step={pageStep} />
            </div>
          </header>
        </Mobile>
        <Desktop>
          <Link href="/signin">
            <a className={ style.Logo }>Peeka</a>
          </Link>
        </Desktop>
        { pagecontent() }
      </div>
      <footer>
        <Button
          type="action"
          theme="primary"
          block={ true }
          additionalClass={ style.SignUpButton }
          onClick={ () => onClickNextHandler() }
          style={ submitButtonStyle }
          disabled={ !enableClick }
        >
          { footerButtonText[pageStep] }
        </Button>
      </footer>
    </div>
  )
}

SignUp.getLayout = LayoutType.Sign

export default SignUp