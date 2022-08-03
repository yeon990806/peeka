import { IsMobile } from "@/common/hooks/breakpoints";
import Popup from "@/components/Popup";
import Screen from "@/components/Screen";

export enum termstype {
  ServiceTerm = 0,
  PrivacyTerm = 1,
}

interface TermsPopupProps {
  display: boolean;
  termstype: termstype;
}

const TermsPopup = (props: TermsPopupProps) => {
  if (IsMobile())
    return <Screen
      display
      content={
        <></>
      }
    />
  return (
    <></>
  )
}

export default TermsPopup