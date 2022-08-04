import classNames from 'classnames';
import { useMemo } from 'react';
import style from "./style.module.scss"

interface ImageViewProps {
  full?: boolean
  src: string
  imageHeight?: number
  onClick?: () => void
}

const ImageView = (props: ImageViewProps) => {
  const ImageStyle = useMemo(() => ({
    height: props.full ? '100%' : props.imageHeight ? props.imageHeight : 'auto',
    backgroundImage: props.full ? '' : `url(${ props.src })`
  }), [props.imageHeight, props.src])

  return (
    <div className={ classNames(style.ImageView, style.FullMode) } style={ ImageStyle } onClick={ props.onClick }>
      { props.full && <img src={ props.src } /> }
    </div>
  )
}

ImageView.defaultProps = {
  imageHeight: 'auto'
}

export default ImageView