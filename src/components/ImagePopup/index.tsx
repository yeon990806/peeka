import Slider from "react-slick";
import { memo, useEffect, useMemo, useRef } from 'react';

import style from "./style.module.scss"
import Button from "../Button";
import ImageView from "../ImageView";
import { useDispatch, useSelector } from "react-redux";
import { ImageType, StateType } from "@/common/defines/Store";
import { TOGGLE_POPUP_DISPLAY } from "@/store/reducer/post";

const ImagePopup = () => {
  const dispatch = useDispatch()
  const popupDisplay = useSelector((state: StateType) => state.post.displayImagePopup)
  const imageArray = useSelector((state: StateType) => state.post.popupIamgeArray)
  const imageIndex = useSelector((state: StateType) => state.post.popupImageCurrentIdx)
  let slideRef = useRef(null)

  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SlickPrevArrow />,
    nextArrow: <SlickNextArrow />,
  }), [])

  const toggleImagePopup = () => {
    dispatch({
      type: TOGGLE_POPUP_DISPLAY
    })
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

  useEffect(() => {
    if (slideRef.current) slideRef.current.slickGoTo(imageIndex || 0)
  }, [slideRef])

  if (!popupDisplay) return null

  return (
    <div className={ style.ImagePopup }>
      <Button
        additionalClass={ style.ImagePopupClose }
        onClick={ () => toggleImagePopup() }
        type="text"
      >
        &times;
      </Button>
      <div className={ style.ImagePopupSlider }>
        <Slider
          {...settings}
          ref={ slideRef }
        >
          { imageArray.map((img: ImageType, idx) => (
            <ImageView
              full
              src={ img.uploadedFileURL }
              key={ idx }
            />
          )) }  
        </Slider>
      </div>
    </div>
  )
}

export default memo(ImagePopup)