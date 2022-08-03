import { ImageType } from '@/common/defines/Store';
import { useCallback, useMemo, useState } from "react";
import { IsDesktop } from '@/common/hooks/breakpoints'
import Slider from "react-slick";
import ImageView from "../ImageView";
import Button from "../Button";
import ImagePopup from "../ImagePopup";
import classnames from "classnames"

import style from "./style.module.scss"

interface ImageSlideProps {
  slideHeight?: number
  imageArray: ImageType[]
  dots: boolean
  infinite: boolean
  speed: number
  slidesToShow: number
  slidesToScroll: number
  arrow: boolean
}

function SlickPrevArrow (props) {
  const { className, style, onClick } = props;

  return (
    <Button
      additionalClass={ className }
      style={ { ...style } }
      onClick={ onClick }
    >
      <img src="/images/prev.svg" tabIndex={ -1 } />
    </Button>
  );
}

function SlickNextArrow (props) {
  const { className, style, onClick } = props;

  return (
    <Button
      additionalClass={ className }
      style={ { ...style } }
      onClick={ onClick }
    >
      <img src="/images/next.svg" tabIndex={ -1 } />
    </Button>
  );
}

const ImageSlide = (props: ImageSlideProps) => {
  const desktop = IsDesktop()
  const slickSetting = useMemo(() => ({
    dots: props.dots,
    infinite: props.infinite,
    speed: props.speed,
    slidesToShow: props.slidesToShow,
    slidesToScroll: props.slidesToScroll,
    arrow: props.arrow,
    adaptiveHeight: false,
    draggable: false,
    prevArrow: <SlickPrevArrow />,
    nextArrow: <SlickNextArrow />,
    className: "ImageSlider"
  }), [props])
  const [showImageZoom, setShowImageZoom] = useState<boolean>(false)

  const onZoom = useCallback(() => {
    setShowImageZoom(true)
  }, [])

  const onClose = useCallback(() => {
    setShowImageZoom(false)
  }, [])

  return (
    <div
      className={ classnames(style.ImageSlide, desktop && style.md ) }
    >
      { showImageZoom && <ImagePopup /> }
      { (props.imageArray && props.imageArray.length > 1) && <div className={ style.SlideMultiImage }>
        <img src="/images/multi-image.svg" role="presentation" alt="multi images" />
      </div> }
      <Slider
        {...slickSetting}
      >
        { props.imageArray && props.imageArray.map((img, idx) => (
          <ImageView
            key={ idx }
            src={ img.uploadedFileURL }
            // alt={ img.alt || "" }
            imageHeight={ props.slideHeight }
            onClick={ () => onZoom() }
          />
        )) }
      </Slider>
    </div>
  )
}

ImageSlide.DefaultProps = {
  imageArray: [],
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrow: true
}

export default ImageSlide