import style from "./style.module.scss"
import { DefaultProps } from '@/common/defines/Props';
import { IsDesktop } from "@/common/hooks/breakpoints";
import classNames from "classnames";

interface TopButtonProps extends DefaultProps {
  onClick: () => void;
}

const TopButton = (props: TopButtonProps) => {
  const desktop = IsDesktop()
  return (
    <button
      className={ classNames(style.TopButton, desktop && style.DesktopButton ) }
      onClick={ props.onClick }
    >
      <img src="/images/top.svg" alt="가장 위로" tabIndex={-1} role="presentation" />
    </button>
  )
}

export default TopButton