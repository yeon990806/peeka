import style from "./style.module.scss"
import classNames from "classnames"
import { useCallback, useState, useMemo } from "react";
import ChangeImagePopup from "./Component/ChangeImagePopup";

interface UserProfileProps {
  size: "xxs" | "xs" | "sm" | "lg" | "xl"
  profileImage?: string;
  userMembership?: boolean;
  changeImage?: boolean;
}

const UserProfile = (props: UserProfileProps) => {
  const [popupDisplay, setPopupDisplay] = useState<boolean>(false)

  const ImageStyle = useMemo(() => ({
    backgroundImage: `url(${ props.profileImage || '' })`
  }), [props.profileImage])

  const togglePopupDisplay = useCallback((v?: boolean) => setPopupDisplay(v === undefined ? prev => !prev : v), [popupDisplay])

  return (
    <div className={ style.UserProfileContainer }>
      { props.changeImage && <ChangeImagePopup
        popupDisplay={ popupDisplay }
        profileImage={ props.profileImage }
        onClose={ (v) => togglePopupDisplay(v) }
      /> }
      <div
        className={ classNames( 
          style.UserProfile, 
          props.size && style[props.size],
          props.userMembership && style.UserMembership
        ) }
        style={ ImageStyle }
        onClick={ () => togglePopupDisplay() }
      >
        { !props.profileImage && <img src="/images/person.svg" tabIndex={-1} role="presentation" /> }
        { props.changeImage && <div className={ style.ChangeImage }>
          이미지 <br />
          변경
        </div> }
      </div>
    </div>
  )
}

export default UserProfile