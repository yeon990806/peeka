import classNames from "classnames"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import style from "./style.module.scss"
import Button from "../Button";
import UserProfile from "../UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { ADD_POST_REQUEST, UPDATE_POST_REQUEST } from "@/store/reducer/post";
import { IsMobile } from '@/common/hooks/breakpoints';
import SelectBox from "../SelectBox";
import Textarea from "../Textarea";
import { encodeFileToBase64 } from "@/common/defines/Format";
import { ImageType, PostType, StateType, StorePostType } from "@/common/defines/Store";
import { openPopup } from "@/store/reducer/popup";
import { PopupCode } from "@/common/defines/Popup";
interface InputPostProps {
  placeholder?: string;
  popup?: boolean;
  post?: PostType;
  postIdx?: number;
  row?: number;
  postType?: StorePostType;

  onSubmit?: () => void;
}

interface PostImageType {
  image: File,
  url: any,
  lastModified?: number,
  idx?: string
}

const InputPost = (props: InputPostProps) => {
  const mobile = IsMobile()
  const dispatch = useDispatch()
  const userImage = useSelector((state: StateType) => state.user.userInfo.image)
  const globalCategory = useSelector((state: StateType) => state.post.postCategory)
  const [inputValue, setInputValue] = useState<string>('')
  const [fileList, setFileList] = useState<FileList>()
  const [uploadImage, setUploadImage] = useState<PostImageType[]>([])
  const [postCategory, setPostCategory] = useState<{ display: string; value: string; } | null>()
  const [postImage, setPostImage] = useState<PostImageType[]>([])
  const [deletedImage, setDeletedImage] = useState<ImageType[]>([])
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
    
    fileData = fileData.sort((a, b) => (a as File).lastModified - (b as File).lastModified)
    
    fileData.forEach((file: File) => {
      if (dataTransfer.files.length < 6 - postImage.length) {
        dataTransfer.items.add(file)
      }
    })

    setFileList(dataTransfer.files)
  }, [fileList])

  const onSubmitPost = useCallback(() => {
    if (!postCategory)
      return dispatch(openPopup(PopupCode.CATEGORY_NULL))

    if (!props.post)
      dispatch({
        type: ADD_POST_REQUEST,
        data: {
          contents: inputValue,
          category_code: postCategory.value,
          category: postCategory.display,
          images: fileList,
          memberImage: userImage.uploadedFileURL || '',
          onSuccess: () => {
            setInputValue('')
            setUploadImage([])
            setFileList(null)
            if (props.onSubmit) props.onSubmit()
          }
        }
      })
    else
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: {
          id: props.post.id,
          contents: inputValue,
          postType: props.postType,
          category_code: postCategory.value,
          category: postCategory.display,
          images: fileList,
          memberImage: userImage.uploadedFileURL || '',
          deleted_images: deletedImage,
          onSuccess: () => {
            setInputValue('')
            setPostCategory(undefined)
            if (props.onSubmit) props.onSubmit()
          }
        }
      })
  }, [uploadImage, inputValue, postCategory])
    

  const removeImage = (clickedImage: PostImageType) => {
    setUploadImage(uploadImage.filter((v) => v.url !== clickedImage.url))

    if (clickedImage.image) {
      const dataTransfer = new DataTransfer()
      imageInput.current.value = ''
  
      Array.from(fileList)
        .filter(file => file !== clickedImage.image)
        .forEach(file => {
          dataTransfer.items.add(file)
        })
  
      setFileList(dataTransfer.files)
    } else {
      setPostImage(prev => prev.filter(v => v.url !== clickedImage.url))
      setDeletedImage([ ...deletedImage, props.post.images[clickedImage.idx] ])
    }
  }

  useEffect(() => {
    if (props.post) {
      const category = selectArray.find(v => v.value === props.post.category_code)

      onInputContent(props.post.contents)
      setPostCategory(category)

      if (props.post.images) {
        props.post.images.map((v, i) => {
          const _img = {
            image: null,
            url: v.uploadedFileURL,
          }

          setPostImage(prev => ([...prev, _img]))
        })
      }
    }
  }, [props.post])

  useEffect(() => {
    if (fileList) {
      setUploadImage([])
      Array.from(fileList).forEach(async (image) => {
        await encodeFileToBase64(image)
          .then((data: File) => setUploadImage((prev) => [...prev, { image: image, url: data, lastModified: image.lastModified }]))
      })
    }
  }, [fileList])

  useEffect(() => {
    const category = selectArray.find(v => v.value === globalCategory)
    
    setPostCategory(category)
  }, [globalCategory])

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
          row={ props.row || 1 }
          value={ inputValue }
          additionalClass={ style.InputForm }
          onInput={ (v: string) => onInputContent(v) }
          placeholder={ props.placeholder }
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
        { postImage.map((v, i) => (
          <div className={ style.PostImage } key={ `post-${i}` }>
            <div className={ style.RemovePostImage } onClick={ () => removeImage(v) }>
              &times;
            </div>
            <img src={ v.url } />
          </div>
        )) }
        { uploadImage.map((v, i) => (
          <div className={ style.PostImage } key={ i }>
            <div className={ style.RemovePostImage } onClick={ () => removeImage(v) }>
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