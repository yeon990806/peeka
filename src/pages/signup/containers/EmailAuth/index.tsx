import axios from "axios";
import router from "next/router";
import Button from "@/components/Button";
import GoogleButton from "@/components/GoogleButton";
import Input from "@/components/Input";
import SignUpContainer from "../../components/SignUpContainer";
import { useCallback, useState } from "react";
import { APIHost } from "@/common/api";

import style from "../../style.module.scss";

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

  const onSetDuplicatedEmail = useCallback((v) => setDuplicatedEmail(v), [props.userEmail, duplicatedEmail])

  const existenceEmail = async (email: string) => {
    const result = await axios.get(`${ APIHost }/public/auth/email/existence?email=${ email }`)

    onSetDuplicatedEmail(result.data.statement)

    return result.data.statement
  }

  return (
    <SignUpContainer
      content={
        <div className={ style.InputEmail }>
          <div className={ style.Input }>
            <Input
              renderFocus
              type="text"
              value={ props.userEmail }
              description={ !duplicatedEmail && !emailError && props.userEmail.length === 0 && "아이디로 사용할 이메일 주소를 입력해주세요." }
              existedValue={ duplicatedEmail }
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
                  const validEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
  
                  if (v.match(validEmail) !== null)
                    return { state: true, msg: "" }
                  else
                    return { state: false, msg: "이메일을 다시 한번 확인해주세요." }
                },
               ]}
              onInput={ (v) => { 
                props.setUserEmail(v); 
              } }
              onChange={ (v) => {
                existenceEmail(v)
              } }
              onError={ (v) => setEmailError(v) }
            />
            { duplicatedEmail && <div className={ style.EmailIssue }>
              <p>이미 가입된 이메일입니다. 로그인하실래요?</p>
              <Button type="text" theme="primary" onClick={ () => router.replace('/signin') }>
                로그인
              </Button>
              <p>만약 비밀번호가 생각이 나지 않는다면</p>
              <Button type="text" theme="primary" onClick={ () => router.replace('/recover') }>비밀번호 찾기</Button>
            </div> }
          </div>
          <div className={ style.Input }>
            { props.sentCode && <Input
              value={ props.authCode }
              placeholder="인증코드 4자리"
              maxLength={4}
              inputmode="numeric"
              onInput={ (v) => props.setAuthCode(v) }
              onEnter={ (v) => props.onClickAuthButton() }
              description={ props.codeError || (props.sentCode && "인증번호가 전송되었어요. (제한시간 5분)") }
            /> }
          </div>
        </div>
      }
      option={ <GoogleButton type="signUp" /> }
    />
  );
}

export default EmailAuth