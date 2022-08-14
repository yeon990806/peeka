import Button from "../Button";
import style from "./style.module.scss"
import { useCallback } from 'react';

interface PopupProps {
  display: boolean;
  content?: string | React.ReactNode;
  type: "alert" | "confirm" | "input",
  buttonAlign: "left" | "center" | "right"
  placeholder?: string;
  submitText?: string;
  param?: any;
  onClick?: () => void;
  onCancel?: () => void;
  confirmDisable?: boolean;
}

const Popup = (props: PopupProps) => {
  const submitAction = useCallback(() => {
    
  }, [])

  if (!props.display) return null
  
  return (
    <div className={ style.Popup }>
      <div className={ style.PopupModal }>
        <article>
          { props.content }
        </article>
        <footer className={ props.buttonAlign && style[props.buttonAlign] }>
          { props.type !== 'alert' && <Button
            type="text"
            theme="light"
            onClick={ () => props.onCancel() }
          >
            취소
          </Button> }
          { !props.confirmDisable && <Button
            type="text"
            theme="primary"
            onClick={ () => props.onClick() }
          >
            { props.submitText || props.type === "input" ? "저장" : "확인" }
          </Button> }
        </footer>
      </div>
    </div>
  )
}

export default Popup