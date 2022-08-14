import { APIHost } from "@/common/api";
import { getCookie } from "@/common/libs/Cookie";
import Input from "@/components/Input";
import Popup from "@/components/Popup";
import { SIGN_OUT_REQUEST } from "@/store/reducer/user";
import axios from "axios";
import Router from "next/router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import style from "./style.module.scss"

interface WithDrawPopupProps {
  display: boolean;
  onPrev: () => void;
}

const WithDrawPopup = (props: WithDrawPopupProps) => {
  const dispatch = useDispatch()
  const [inputPassword, setInputPassword] = useState<string>('')
  const [consistentText, setConsistentText] = useState<boolean>(false)
  const [onError, setOnError] = useState<string>('')

  const onChangeInputPassword = useCallback((v: string) => setInputPassword(v), [inputPassword])
  const onChangeError = useCallback((v: string) => setOnError(v), [onError])

  const onWithDraw = useCallback(async () => {
    try {
      const result = await axios.delete(`${ APIHost }/member/withdrwal`, {
        data: {
          // email: 
          password: inputPassword
        },
        headers: {
          Authorization: `Bearer ${ getCookie('accessToken') }`
        }
      })

      if (result.status === 200) {
        onChangeError('')
        dispatch({
          type: SIGN_OUT_REQUEST,
        })
        
        Router.push('/community')
      }

    } catch (err) {
      onChangeError('비밀번호가 틀립니다. 다시 시도해주세요.')
    }
  }, [inputPassword])

  if (!props.display) return null

  return <Popup
    display={ props.display }
    type="confirm"
    buttonAlign="right"
    confirmDisable={ !consistentText }
    content={ <div className={ style.PopupContent }>
      <Input
        value={ inputPassword }
        type="password"
        togglePassword
        placeholder="기존 비밀번호"
        onInput={ (v) => onChangeInputPassword(v) }
        validate={[
          (v: string) => {
            const validPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^~*+=-])(?=.*[0-9]).{8}$/

            if (v.match(validPassword) !== null) {
              setConsistentText(true)

              return { state: true, msg: '' }
            } else {
              setConsistentText(false)

              return { state: false, msg: '' }
            }
          },
        ]}
        />
        { onError && <div className={ style.OnError }>
          { onError }
        </div> }
    </div> }
    onCancel={ () => props.onPrev() }
    onClick={ () => onWithDraw() }
  />
}

export default WithDrawPopup