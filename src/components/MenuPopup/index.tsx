import style from "./style.module.scss"
import Button, { ButtonTheme, ButtonType } from '@/components/Button';
import { DefaultProps } from '@/common/defines/Props';
import { createRef, useEffect, useState } from "react";

interface MenuPopupProps extends DefaultProps {
  menuList: PopupItemProps[];
  type?: ButtonType;
  theme?: ButtonTheme;
}

export interface PopupItemProps {
  text: string;
  onClick: (e) => void;
}

const PopupItem = (props: PopupItemProps) => {
  return (
    <Button
      additionalClass={ style.PopupItem }
      type="normal"
      size="sm"
      theme="gray"
      onClick={ props.onClick }
      style={ {
        textAlign: 'left',
        fontSize: 14,
        fontWeight: 'normal'
      } }
      sharp
    >
      { props.text }
    </Button>
  )
}

const MenuPopup = (props: MenuPopupProps) => {
  const [popupDisplay, setPopupDisplay] = useState<boolean>(false)
  const ref = createRef<HTMLDivElement>()

  useEffect(() => {
    const onClickOutside = e => {
      if (popupDisplay && (ref.current && !ref.current.contains(e.target)))
        setPopupDisplay(false)
    }

    document.addEventListener('mousedown', onClickOutside)

    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [popupDisplay])

  return (
    <div className={ style.MenuPopup }>
      <Button
        type={ props.type }
        theme={ props.theme }
        onClick={ () => setPopupDisplay(prev => !prev) }
      >
        { props.children }
      </Button>
      { popupDisplay && <div className={ style.MenuPopupContent } ref={ ref }>
        { props.menuList.map((v, i) => (
          <PopupItem
            key={ i }
            text={ v.text }
            onClick={ (e) => {
              setPopupDisplay(false)
              v.onClick(e)
            } }
          />
        )) }
      </div> }
    </div>
  )
}

export default MenuPopup