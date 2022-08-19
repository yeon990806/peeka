import { APIHost } from "@/common/api"
import { encodeFileToBase64 } from "@/common/defines/Format"
import { StateType } from "@/common/defines/Store"
import { getCookie } from "@/common/libs/Cookie"
import Button from "@/components/Button"
import Popup from "@/components/Popup"
import { FETCH_USERINFO_REQUEST, UPDATE_USERINFO } from "@/store/reducer/user"
import axios from "axios"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import style from './style.module.scss'

interface ChangeImagePopupProps {
  popupDisplay: boolean
  profileImage: string
  onClose: (v?: boolean) => void
}

const ChangeImagePopup = (props: ChangeImagePopupProps) => {
  const dispatch = useDispatch()
  const userImage = useSelector((state: StateType) => state.user.userInfo.image)
  const imageInput = useRef<HTMLInputElement>(null)
  const [uploadImage, setUploadImage] = useState<File | null>(null)
  const [tempImage, setTempImage] = useState<string>('')
  const [onError, setOnError] = useState<boolean>(false)

  const ImageStyle = useMemo(() => ({
    backgroundImage: `url(${ tempImage || props.profileImage || '' })`
  }), [props.profileImage, tempImage])

  const closePopup = useCallback(() => {
    onResetProfileImage()
    setOnError(false)
    props.onClose(false)
  }, [props.popupDisplay])

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click()
  }, [imageInput.current])

  const onChangeProfileImage = useCallback((e) => {
    setUploadImage(e.target.files[0])
  }, [uploadImage])

  const onResetProfileImage = useCallback(() => {
    imageInput.current.value = null
    setTempImage('')
  }, [tempImage, uploadImage])

  const onSaveProfileImage = useCallback(async () => {
    const f = new FormData()

    if (uploadImage) f.append('image', uploadImage)
    else return

    try {
      const result = await axios.patch(`${ APIHost }/member/profile/image`, f, {
        headers: {
          'Authorization': `Bearer ${ getCookie('accessToken') }`
        }
      })
  
      setOnError(false)

      if (result.status === 200) {
        dispatch({
          type: FETCH_USERINFO_REQUEST,
        })

        closePopup()
      }
      else
        setOnError(true)
    } catch (err) {
      setOnError(true)
    }
  }, [uploadImage, tempImage])

  useEffect(() => {
    const getImageObject = (image: File) => {
      encodeFileToBase64(image).then(data => setTempImage(data.toString()))
    }

    if (uploadImage) getImageObject(uploadImage)
  }, [uploadImage])
  
  if (!props.popupDisplay) return;

  return (
    <>
      <Popup
        display={ props.popupDisplay }
        content={
          <>
            <div className={ style.ChangeImagePopup }>
              <div className={ style.ChangeImage } style={ ImageStyle }>
                { (!props.profileImage && !tempImage) && <img src="/images/person.svg" tabIndex={ -1 } role="presentation" /> }
              </div>
              <div className={ style.ButtonContainer }>
                <Button
                  type="text"
                  theme="primary"
                  onClick={ () => onClickImageUpload() }
                >
                  이미지 선택
                </Button>
                <Button type="text" theme="light-gray" onClick={ () => onResetProfileImage() }>
                  초기화
                </Button>
              </div>
              { onError && <div className={ style.onError }>
                이런! 저장에 실패했어요. 다시 시도해주세요.
              </div> }
            </div>
          </>
        }
        type="confirm"
        buttonAlign="right"
        onCancel={ () => closePopup() }
        onClick={ () => onSaveProfileImage() }
        confirmDisable={ !tempImage }
      />
      <input
        type="file"
        name="images"
        hidden
        accept="image/*"
        ref={ imageInput }
        onChange={ (e) => onChangeProfileImage(e) }
      />
    </>
  )
}

export default ChangeImagePopup