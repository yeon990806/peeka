import style from "./style.module.scss"
import { DefaultProps } from '@/common/defines/Props';

interface TopButtonProps extends DefaultProps {
  onClick: () => void;
}

const TopButton = (props: TopButtonProps) => {
  return (
    <button
      className={ style.TopButton }
      onClick={ (e) => props.onClick }
      style={ props.style }
    >
      <img src="/images/top.svg" alt="가장 위로" tabIndex={-1} role="presentation" />
    </button>
  )
}

export default TopButton