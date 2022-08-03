import Slider from "react-slick";
import { memo, useMemo, useState } from 'react';

import style from "./style.module.scss"
import Button from "../Button";
import ImageView from "../ImageView";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/common/defines/Store";
import { TOGGLE_POPUP_DISPLAY } from "@/store/reducer/post";

const ImagePopup = () => {
  const dispatch = useDispatch()
  const popupDisplay = useSelector((state: StateType) => state.post.displayImagePopup)
  const imageArray = useSelector((state: StateType) => state.post.popupIamgeArray)
  const [currentImage, setCurrentImage] = useState<number>(0)

  const settings = useMemo(() => ({
    className: "",
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    variableWidth: true,
  }), [])

  const toggleImagePopup = () => {
    dispatch({
      type: TOGGLE_POPUP_DISPLAY
    })
  }

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
        <Slider { ...settings }>
          { imageArray && imageArray.map((img, idx) => (
            <ImageView
              key={ idx }
              src={ img.src }
            />
          )) }
        </Slider>
      </div>
    </div>
  )
}

export default memo(ImagePopup)