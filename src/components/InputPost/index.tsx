import classNames from "classnames"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import style from "./style.module.scss"
import Button from "../Button";
import UserProfile from "../UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "@/store/reducer/post";
import { IsMobile } from '@/common/hooks/breakpoints';
import SelectBox from "../SelectBox";
import Textarea from "../Textarea";
import { encodeFileToBase64 } from "@/common/defines/Format";
import { StateType } from "@/common/defines/Store";

interface InputPostProps {
  placeholder?: string;
  popup?: boolean;
  postIdx?: number;

  onSubmit?: () => void;
}

const InputPost = (props: InputPostProps) => {
  const mobile = IsMobile()
  const dispatch = useDispatch()
  const userImage = useSelector((state: StateType) => state.user.userInfo.image)
  const [inputValue, setInputValue] = useState<string>('')
  const [fileList, setFileList] = useState<FileList>()
  const [uploadImage, setUploadImage] = useState<{ image: File, url: any, lastModified: number }[]>([])
  const [postCategory, setPostCategory] = useState<{ display: string; value: string; } | null>(null)
  const imageInput = useRef<HTMLInputElement>(null)

  const selectArray = [
    { display: "영화", value: "MV" },
    { display: "시리즈", value: "SE" },
    { display: "웹툰", value: "WT" },
    { display: "웹소설", value: "WN" }
  ]

  const SelectboxStyle = useMemo(() => ({ marginRight: 8 }), [])
  const onInputContent = useCallback((v: string) => setInputValue(v), [inputValue])
  const onClickImageUpload = useCallback((e) => {
    imageInput.current.click()
  }, [imageInput.current])

  const onHandleUploadImage = useCallback((e) => {
    const dataTransfer = new DataTransfer()
    let fileData = fileList ? Array.from(fileList).concat(Array.from(e.target.files)) : Array.from(e.target.files)
    
    fileData.forEach((file: File) => {
      dataTransfer.items.add(file)
    })

    setFileList(dataTransfer.files)
  }, [fileList])

  const onSubmitPost = useCallback(() => dispatch(addPost({
    contents: inputValue,
    category_code: postCategory.value,
    category: postCategory.display,
    images: fileList,
    submit: props.onSubmit
  })), [uploadImage, inputValue, postCategory])

  const removeImage = (clickedImage: File) => {
    const dataTransfer = new DataTransfer()

    Array.from(fileList)
      .filter(file => file !== clickedImage)
      .forEach(file => {
        dataTransfer.items.add(file)
      })

    setFileList(dataTransfer.files)
  }

  useEffect(() => {
    if (fileList) {
      setUploadImage([])
      Array.from(fileList).forEach(async (image) => {
        await encodeFileToBase64(image)
          .then((data: File) => setUploadImage((prev) => [...prev, { image: image, url: data, lastModified: image.lastModified }].sort((a, b) => a.lastModified - b.lastModified)))
      })
    }
  }, [fileList])

  return (
    <form
      className={ classNames(style.InputPost,
        props.popup && style.InputPostPopup,
        !mobile && style.DesktopInputPost
      ) }
      encType="multipart/form-data"
    >
      <div className={ style.InputFormContainer }>
        <UserProfile
          size="xs"
          profileImage={ userImage ? userImage.uploadedFileURL : '' }
        />
        <Textarea
          block
          borderless
          paddingless
          row={ 1 }
          value={ inputValue }
          additionalClass={ style.InputForm }
          onInput={ (v: string) => onInputContent(v) }
        />
      </div>
      <div className={ style.InputPostAction }>
        <div>
          <SelectBox
            width={ 96 }
            placeholder="카테고리"
            value={ postCategory }
            items={ selectArray }
            style={ SelectboxStyle }
            onClick={ (v) => setPostCategory(v) }
          />
        </div>
        <div>
          <Button type="icon" onClick={ (e) => onClickImageUpload(e) }>
            <img src="/images/image-upload.svg" tabIndex={-1} />
          </Button>
          <Button
            type="round"
            theme="primary"
            disabled={ inputValue.length === 0 }
            onClick={ () => onSubmitPost() }
            additionalClass={ style.PostSubmitButton }
          >
            등록
          </Button>
        </div>
      </div>
      <div className={ classNames( style.PostImageContainer, mobile && style.MobileGrid ) }>
        { uploadImage.map((v, i) => (
          <div className={ style.PostImage } key={ i }>
            <div className={ style.RemovePostImage } onClick={ () => removeImage(v.image) }>
              &times;
            </div>
            <img src={ v.url } />
          </div>
        )) }
      </div>
      <input
        type="file"
        name="images"
        multiple
        hidden
        accept='image/*' 
        ref={ imageInput }
        onChange={ (e) => onHandleUploadImage(e) }
      />
    </form>
  )
}

export default InputPost