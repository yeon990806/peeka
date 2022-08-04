import { ImageType } from '@/common/defines/Store';
import { useCallback, useMemo, useState } from "react";
import { IsDesktop } from '@/common/hooks/breakpoints'
import classnames from "classnames"
import Button from "../Button";
import Slider from "react-slick";
import ImageView from "../ImageView";
import ImagePopup from "../ImagePopup";

import style from "./style.module.scss"
import { useDispatch } from 'react-redux';
import { CHANGE_POPUP_IMAGES } from '@/store/reducer/post';

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
  const dispatch = useDispatch()
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

  const onZoom = useCallback((v: number) => {
    dispatch({
      type: CHANGE_POPUP_IMAGES,
      data: {
        images: props.imageArray,
        currentIdx: v
      }
    })
  }, [])

  return (
    <div
      className={ classnames(style.ImageSlide, desktop && style.md ) }
    >
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
            onClick={ () => onZoom(idx) }
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