import { GoogleSignIn } from "@/common/api"
import { setCookie } from "@/common/libs/Cookie"
import { TOGGLE_SIGN_IN_POPUP } from "@/store/reducer/popup"
import { FETCH_USERINFO_REQUEST, SET_SIGN_UP_PARAMETER, UPDATE_USERINFO } from "@/store/reducer/user"
import { useRouter } from "next/router"
import { memo, useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import style from "./style.module.scss"

interface GoogleButtonProps {
  type: "signIn" | "signUp"
  popup?: boolean
}

const GoogleButton = memo((props: GoogleButtonProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const onClickEventHandler = useCallback(() => {
    window.open(GoogleSignIn, 'auth')
  }, [props.type])

  useEffect(() => {
    window.afterAction = (type, data) => {
      switch (type) {
        case 'signin':
          setCookie('accessToken', data.access_token)
          setCookie('refreshToken', data.refresh_token)
          setCookie('userInfo', data)

          if (data.access_token) {
            dispatch({
              type: UPDATE_USERINFO,
              data,
            })
            dispatch({
              type: FETCH_USERINFO_REQUEST,
            })

          }

          if (props.popup)
            dispatch({
              type: TOGGLE_SIGN_IN_POPUP
            })
          else
            router.replace('/community')

          break
        case 'signup':
          dispatch({
            type: SET_SIGN_UP_PARAMETER,
            data: {
              email: data.email
            }
          })

          router.replace('/signup')
          break
      }
    }
    return () => {
      window.afterAction = undefined
    }
  }, [])
 
  return (
    // <GoogleLogin
    //   clientId={ process.env.REACT_APP_GOOGLE_API_KEY }
    // />
    <button
      className={ style.GoogleButton }
      onClick={ () => onClickEventHandler() }
    >
      <img src="/images/google-logo.svg" tabIndex={-1} alt="google login" />
      { props.type === 'signIn' ? '구글 아이디로 로그인' : '구글 아이디로 가입' }
    </button>
  )
})

export default memo(GoogleButton)