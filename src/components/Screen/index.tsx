import style from "./style.module.scss"
import Button from '@/components/Button';
import InputPost from "../InputPost";
import { DefaultProps } from "@/common/defines/Props";

interface ScreenProps extends DefaultProps {
  display: boolean
  title?: string | React.ReactNode
  content: string | React.ReactNode
  
  onCancel?: () => void
}

const Screen = (props: ScreenProps) => {
  if (!props.display) return
  return (
    <div className={ style.Screen }>
      <header className={ style.ScreenHeader }>
        <Button
          type="icon"
          onClick={ () => props.onCancel() }
          >
          <img src="/images/prev.svg" tabIndex={ -1 } />
        </Button>
        { props.title && <h1>{ props.title }</h1> }
      </header>
      <div className={ style.ScreenContent }>
        { props.content }
      </div>
    </div>
  )
}

export default Screen