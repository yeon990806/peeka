import { IsMobile } from "@/common/hooks/breakpoints"
import { SIGN_OUT_REQUEST } from "@/store/reducer/user"
import { useDispatch } from "react-redux"
import SignIn from "src/pages/signin"
import Popup from "../Popup"
import Screen from "../Screen"

interface SignInPopupProps {
  display: boolean
  onClose: () => void
}

const SignInPopup = (props: SignInPopupProps) => {
  const mobile = IsMobile()
  const dispatch = useDispatch()

  const closePopup = () => {
    dispatch({
      type: SIGN_OUT_REQUEST
    })

    props.onClose()
  }

  if (mobile)
    return (
      <Screen
        display={ props.display }
        content={
          <SignIn popup/>
        }
        onCancel={ closePopup }
      />
    )
  return (
    <Popup
      display={ props.display }
      type={ "cancel" }
      content={ <SignIn popup/> }
      buttonAlign={"right"} 
      onCancel={ closePopup }
      block
    />
  )
}

export default SignInPopup