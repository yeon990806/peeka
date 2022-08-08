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
        return <h1>서비스 이용약관</h1>
      case termstype.PrivacyTerm:
        return <h1>개인정보 수집 동의 약관</h1>
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
            <iframe src="https://docs.google.com/document/d/e/2PACX-1vS_bvPxpF35OPQwAJwg26rcvwsem_D32k0zMpUrikflimuER2jDOswaLTYAEZ5JaG1jgJQdVYvLv3SN/pub?embedded=true"></iframe>
          </div>
        )
    }
  }
  if (Mobile)
    return <Screen
      display
      title={ renderHeader() }
      content={ renderContent() }
      onCancel={ props.onClose }
    />

  return (
    <></>
  )
}

export default TermsPopup