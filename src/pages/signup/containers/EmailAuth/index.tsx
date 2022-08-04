import Button from "@/components/Button";
import GoogleButton from "@/components/GoogleButton";
import Input from "@/components/Input";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import SignUpContainer from "../../components/SignUpContainer";
import router from "next/router";

import style from "../../style.module.scss";
import { useSelector } from "react-redux";
import { StateType } from "@/common/defines/Store";

interface EmailAuthProps {
  userEmail: string;
  sentCode: boolean;
  authCode: string;
  codeError: string;
  setUserEmail: (param: string) => void;
  setAuthCode: (param: string) => void;
  onClickAuthButton: () => void;
}

const EmailAuth = (props: EmailAuthProps) => {
  const [emailError, setEmailError] = useState<boolean>(false)
  const [duplicatedEmail, setDuplicatedEmail] = useState<boolean>(false)
  const userInfo = useSelector((state: StateType) => state.user.userInfo)

  const onSetDuplicatedEmail = useCallback((v) => setDuplicatedEmail(v), [duplicatedEmail])

  const existenceEmail = async (email: string) => {
    const result = await axios.get(`/api/public/auth/email/existence?email=${ email }`)

    return onSetDuplicatedEmail(result.data.statement)
  }

  // useEffect(() => {
  //   if (userInfo)
  //     router.push('/community')
  // }, [userInfo])

  return (
    <SignUpContainer
      content={
        <>
          <div className={ style.Input }>
            <Input
              renderFocus
              type="text"
              value={ props.userEmail }
              description={ !duplicatedEmail && "아이디로 사용할 이메일 주소를 입력해주세요." }
              postfix={
                <>
                  <Button
                    type="normal"
                    theme="primary"
                    disabled={ props.userEmail.length === 0 || emailError || duplicatedEmail }
                    onClick={ () => props.onClickAuthButton() }
                  >
                    인증
                  </Button>
                </>
              }
              validate={[
                (v: string) => {
                  const validEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
  
                  return v.match(validEmail) !== null && !duplicatedEmail
                    ? { state: true, msg: "사용할 수 있는 이메일입니다." }
                    : duplicatedEmail
                      ? { state: false, msg: '' }
                      : { state: false, msg: "이메일을 다시 한번 확인해주세요." }
                },
               ]}
              onChange={ (v) => { props.setUserEmail(v); existenceEmail(v) } }
              onError={ (v) => setEmailError(v) }
            />
            { duplicatedEmail && <div className={ style.EmailIssue }>
              <p>이미 가입된 이메일입니다. 로그인하실래요?</p>
              <Button type="text" theme="primary" onClick={ () => router.replace('/signin') }>
                로그인
              </Button>
              <p>만약 비밀번호가 생각이 나지 않는다면</p>
              <Button type="text" theme="primary">비밀번호 찾기</Button>
            </div> }
          </div>
          <div className={ style.Input }>
            { props.sentCode && <Input
              value={ props.authCode }
              placeholder="인증코드 4자리"
              maxLength={4}
              onChange={ (v) => props.setAuthCode(v) }
              description={ props.codeError || (props.sentCode && "인증번호가 전송되었어요.") }
            /> }
          </div>
        </>
      }
      option={ <GoogleButton type="signUp" /> }
    />
  );
}

export default EmailAuth