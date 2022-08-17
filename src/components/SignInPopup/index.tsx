import { IsMobile } from "@/common/hooks/breakpoints"
import SignIn from "src/pages/signin"
import Popup from "../Popup"
import Screen from "../Screen"

interface SignInPopupProps {
  display: boolean
  onClose: () => void
}

const SignInPopup = (props: SignInPopupProps) => {
  const mobile = IsMobile()

  if (mobile)
    return (
      <Screen
        display={ props.display }
        content={
          <SignIn popup/>
        }
        onCancel={ props.onClose }
      />
    )
  return (
    <Popup
      display={ props.display }
      type={ "cancel" }
      content={ <SignIn popup/> }
      buttonAlign={"right"} 
      onCancel={ props.onClose }
      block
    />
  )
}

export default SignInPopup