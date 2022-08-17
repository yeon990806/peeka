import Button from "../Button";
import style from "./style.module.scss"
import { useCallback } from 'react';
import classNames from "classnames";

interface PopupProps {
  display: boolean;
  content?: string | React.ReactNode;
  type: "alert" | "confirm" | "input" | "full" | "cancel",
  buttonAlign: "left" | "center" | "right"
  placeholder?: string;
  submitText?: string;
  param?: any;
  onClick?: () => void;
  onCancel?: () => void;
  confirmDisable?: boolean;
  block?: boolean
}

const Popup = (props: PopupProps) => {
  const submitAction = useCallback(() => {
    
  }, [])

  if (!props.display) return null
  
  return (
    <div className={ style.Popup }>
      <div className={ classNames(style.PopupModal, props.block && style.block) }>
        <article>
          { props.content }
        </article>
        { props.type !== 'full' && <footer className={ props.buttonAlign && style[props.buttonAlign] }>
          { props.type !== 'alert' && <Button
            type="text"
            theme="light"
            onClick={ () => props.onCancel() }
          >
            취소
          </Button> }
          { (!props.confirmDisable && props.type !== "cancel") && <Button
            type="text"
            theme="primary"
            onClick={ () => props.onClick() }
          >
            { props.submitText || props.type === "input" ? "저장" : "확인" }
          </Button> }
        </footer> }
      </div>
    </div>
  )
}

export default Popup