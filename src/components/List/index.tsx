import classNames from "classnames"
import { DefaultProps } from "@/common/defines/Props"
import style from "./style.module.scss"

interface ListProps extends DefaultProps {
  variant: "primary" | "gray"
}

const List = (props: ListProps) => {
  return (
    <ul className={ classNames(style.List, props.variant && style[props.variant]) }>
      { props.children }
    </ul>
  )
}

export default List