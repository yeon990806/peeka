import { IsMobile } from "@/common/hooks/breakpoints";
import Popup from "@/components/Popup";
import Screen from "@/components/Screen";

import style from './style.module.scss'

export enum termstype {
  ServiceTerm = 0,
  PrivacyTerm = 1,
}

interface TermsPopupProps {
  display: boolean;
  termsType: termstype;
  onClose: () => void;
}

const TermsPopup = (props: TermsPopupProps) => {
  const Mobile = IsMobile()

  const renderHeader = () => {
    switch (props.termsType) {
      case termstype.ServiceTerm:
        return <h1>이용약관</h1>
      case termstype.PrivacyTerm:
        return <h1>개인정보처리방침</h1>
    }
  }

  const renderContent = () => {
    switch (props.termsType) {
      case termstype.ServiceTerm:
        return (
          <div className={ style.Terms }>
            <iframe src="https://docs.google.com/document/d/e/2PACX-1vRawuaB0KQiXjjSGfegcW4VcabFmNu8ieGQ8EErU6CeEbs1TDi0dTgYvKoHXjYNN9vwpBu3W-N8Sn44/pub?embedded=true"></iframe>
          </div>
        )
      case termstype.PrivacyTerm:
        return (
          <div className={ style.Terms }>
            <iframe src="https://docs.google.com/document/d/e/2PACX-1vQcqgmUf6LEM2Jn6yrteh5LgeHJXLj4qViP9vwKTZFKnkb0hCsaYjprpEpb2ypzRjMHokvPHnbOpdDB/pub?embedded=true"></iframe>
          </div>
        )
    }
  }
  
  return <Screen
    display
    title={ renderHeader() }
    content={ renderContent() }
    onCancel={ props.onClose }
  />
}

export default TermsPopup