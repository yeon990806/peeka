import { useMemo } from 'react';
import style from "./style.module.scss"

interface ImageViewProps {
  src: string
  imageHeight?: number
  onClick?: () => void
}

const ImageView = (props: ImageViewProps) => {
  const ImageViewHeight = useMemo(() => ({
    height: props.imageHeight ? props.imageHeight : 'auto',
  }), [props.imageHeight])

  return (
    <div className={ style.ImageView } style={ ImageViewHeight } onClick={ props.onClick }>
      <img className={ style.ImageViewImage } role="presentation" src={ props.src } />
    </div>
  )
}

ImageView.defaultProps = {
  imageHeight: 'auto'
}

export default ImageView