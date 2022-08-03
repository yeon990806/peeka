import classNames from "classnames"
import { DefaultProps } from "@/common/defines/Props"

import style from "./style.module.scss"

export type ButtonTheme = "light" | "gray" | "primary" | "dark" | "invert" | "light-gray"
export type ButtonType = "action" | "border" | "normal" | "icon" | "text" | "round" | "search" | "hashtag"
type ButtonSize = "xs" | "sm" | "ml" | "lg" | "xl"

interface ButtonProps extends DefaultProps {
  block?: boolean;
  theme?: ButtonTheme;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  borderless?: boolean;
  sharp?: boolean;

  onClick?: (e?) => void;
}

const Button = (props: ButtonProps) => {
  return (
    <button
      type="button"
      className={ classNames(
        props.additionalClass,
        style.Button,
        props.block && style.Block,
        props.size && style[props.size],
        props.theme && style[props.theme],
        props.type && style[props.type],
        props.borderless && style.Borderless,
        props.sharp && style.Sharp
      ) }
      style={ props.style }
      disabled={ props.disabled }
      onClick={ props.onClick }
    >
      { props.children }
    </button>
  )
}

Button.defaultProps = {
  type: "normal",
  size: "ml"
}

export default Button