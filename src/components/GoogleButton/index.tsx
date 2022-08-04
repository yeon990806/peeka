import { GoogleSignIn, GooleTest } from "@/common/api"
import { memo, useCallback } from "react"
import style from "./style.module.scss"

interface GoogleButtonProps {
  type: "signIn" | "signUp"
}

const GoogleButton = memo((props: GoogleButtonProps) => {
  const onClickEventHandler = useCallback(() => {
    if (props.type === 'signIn')
      window.open(GoogleSignIn, 'auth')
    else
    window.open(GooleTest, 'auth')
  }, [props.type])
 
  return (
    // <GoogleLogin
    //   clientId={ process.env.REACT_APP_GOOGLE_API_KEY }
    // />
    <button
      className={ style.GoogleButton }
      onClick={ () => onClickEventHandler() }
    >
      <img src="/images/google-logo.svg" tabIndex={-1} alt="google login" />
      구글 아이디로 로그인
    </button>
  )
})

export default memo(GoogleButton)