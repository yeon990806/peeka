import { useState, useCallback, useEffect } from 'react';
import Input from "@/components/Input"
import SignUpContainer from '../../components/SignUpContainer/index';
import Button from '@/components/Button';

import style from "./style.module.scss"

import Checkbox from '@/components/Checkbox';
import { genderType } from '@/common/defines/Signup';
import TermsPopup from '../../components/TermsPopup';
import axios from 'axios';
import { APIHost } from '@/common/api';

interface InputInfoProps {
  userName: string;
  password: string;
  birthDate: string;
  userGender: genderType;
  agreeAll: boolean;
  overYouth: boolean;
  serviceTerms: boolean;
  privacyPolicy: boolean;
  receiveMarketing: boolean;

  setUserName: (v: string) => void;
  setPassword: (v: string) => void;
  setBirthDate: (v: string) => void;
  setUserGender: (v: genderType) => void;
  setAgreeAll: () => void;
  setOverYouth: () => void;
  setServiceTerms: () => void;
  setPrivacyPolicy: () => void;
  setReceiveMarketing: () => void;
}

const InputInfo = (props: InputInfoProps) => {
  const [displayPopup, setDisplayPopup] = useState<boolean>(false)
  const [termsType, setTermsType] = useState<number | null>(null)
  const [existencedUsername, setExistencedUsername] = useState<boolean>(false)

  const onToggleExistenceUsername = useCallback((v) => setExistencedUsername(v), [existencedUsername])
  const onToggleDisplayPopup = useCallback(() => setDisplayPopup(prev => !prev), [displayPopup, termsType])

  const existenceUsername = async (v: string) => {
    const result = await axios.get(`${ APIHost }/public/auth/nickname/existence?nickname=${ v }`)

    return onToggleExistenceUsername(result.data.statement)
  }

  useEffect(() => {
    if (!displayPopup) setTermsType(null)
  }, [displayPopup])

  return (
    <SignUpContainer
      content={
        <>
          { displayPopup && <TermsPopup
            display={ displayPopup }
            termsType={ termsType }
            onClose={ () => setDisplayPopup(false) }
          /> }
          
          <Input
            value={ props.userName }
            placeholder="유저네임"
            onChange={ (v) => {
              props.setUserName(v)
              existenceUsername(v)
            } }
            validate={[
              (v: string) => {
                if (!existencedUsername) return { state: true, msg: '사용할 수 있는 닉네임입니다!' }
                else return { state: false, msg: '사용 중인 닉네임이에요.' }
              }
            ]}
          />
          <Input
            value={ props.password }
            type="password"
            togglePassword
            placeholder="비밀번호"
            description="비밀번호는 8자 이상이어야 하며, 대/소문자, 숫자, 특수문자를 모두 포함하어야 합니다."
            validate={[
              (v: string) => {
                const validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

                return v.match(validPassword) !== null
                  ? { state: true, msg: v }
                  : { state: false, msg: "비밀번호는 8자 이상이어야 하며, 대/소문자, 숫자, 특수문자를 모두 포함하어야 합니다." } 
              }
            ]}
            onInput={ (v) => props.setPassword(v) }
          />
          <Input
            value={ props.birthDate }
            type="text"
            inputmode="numeric"
            placeholder="생년월일"
            maxLength={6}
            description="예: 000101"
            validate={[
              (v: string) => {
                const validDate = /^\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/

                return v.match(validDate) !== null
                  ? { state: true, msg: v }
                  : { state: false, msg: "유효한 날짜 형식이 아닙니다." }
              }
            ]}
            onInput={ (v) => { props.setBirthDate(v) } }
          />
          <div className={ style.Switch }>
            <Button
              type="border"
              size="xl"
              theme={ props.userGender === genderType.M ? "primary" : "gray" }
              onClick={ () => props.setUserGender(genderType.M) }
            >
              남
            </Button>
            <Button
              type="border"
              size="xl"
              theme={ props.userGender === genderType.F ? "primary" : "gray" }
              onClick={ () => props.setUserGender(genderType.F) }
            >
              여
            </Button>
          </div>
        </>
      }
      option={
        <div className={ style.CheckContainer }>
          <Checkbox
            id="agreeAll"
            value={ props.agreeAll }
            onClick={ () => props.setAgreeAll() }
            label="모두 동의합니다"
            block
          />
          <Checkbox
            id="overYouth"
            value={ props.overYouth }
            onClick={ () => props.setOverYouth() }
            label="만 14세 이상입니다."
            block
          />
          <Checkbox
            id="serviceTerms"
            value={ props.serviceTerms }
            onClick={ () => props.setServiceTerms() }
            label="[필수] 이용약관 동의"
            block
            postfix={
              <Button
                type="text"
                theme="light"
                onClick={ () => {
                    setTermsType(0)
                    onToggleDisplayPopup()
                  } 
                }
              >
                보기
              </Button>
            }
          />
          <Checkbox
            id="privacyPolicy"
            value={ props.privacyPolicy }
            onClick={ () => props.setPrivacyPolicy() }
            label="[필수] 개인정보취급 동의"
            block
            postfix={
              <Button
                type="text"
                theme="light"
                onClick={ () => {
                    setTermsType(1)
                    onToggleDisplayPopup()
                  } 
                }
              >
                보기
              </Button>
            }
          />
          <Checkbox
            id="receiveMarketing"
            value={ props.receiveMarketing }
            onClick={ () => props.setReceiveMarketing() }
            label="[선택] 마케팅 메일 수신 동의"
            block
          />
        </div>
      }
    />
  )
}

export default InputInfo