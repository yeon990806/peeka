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
import { DefaultProps } from "@/common/defines/Props";
import { FormatNumber } from "@/common/libs/Format";
import InputHashTag from "../InputHashTag";

interface InputPostProps extends DefaultProps {
  placeholder?: string;
  modify?: boolean;
  popup?: boolean;
  post?: PostType;
  postIdx?: number;
  row?: number;
  postType?: StorePostType;
  modifyHash?: string[];

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
  const addLoading = useSelector((state: StateType) => state.post.addPostLoading)
  const modifyLoading = useSelector((state: StateType) => state.post.updatePostLoading)
  const [inputValue, setInputValue] = useState<string>('')
  const [fileList, setFileList] = useState<FileList>()
  const [uploadImage, setUploadImage] = useState<PostImageType[]>([])
  const [postCategory, setPostCategory] = useState<{ display: string; value: string; } | null>()
  const [postImage, setPostImage] = useState<PostImageType[]>([])
  const [deletedImage, setDeletedImage] = useState<ImageType[]>([])
  const [inputHash, setInputHash] = useState<string>('')
  const [postHash, setPostHash] = useState<string[]>([])
  const imageInput = useRef<HTMLInputElement>(null)

  const selectArray = [
    { display: "영화", value: "MV" },
    { display: "시리즈", value: "SE" },
    { display: "웹툰", value: "WT" },
    { display: "웹소설", value: "WN" }
  ]

  const SelectboxStyle = useMemo(() => ({ marginRight: mobile ? 0 : 8 }), [])

  const onInputContent = useCallback((v: string) => setInputValue(v), [inputValue])
  const onClickImageUpload = useCallback((e) => {
    imageInput.current.click()
  }, [imageInput.current])

  const onHandleUploadImage = useCallback((e) => {
    const dataTransfer = new DataTransfer()
    let fileData = fileList ? Array.from(fileList).concat(Array.from(e.target.files)) : Array.from(e.target.files)
    
    
    fileData.forEach((file: File) => {
      if (dataTransfer.files.length < 6 - postImage.length) {
        file.idx = fileData.findIndex((v: File) => v.lastModified === file.lastModified).toString()

        dataTransfer.items.add(file)
      }
    })

    fileData = fileData.sort((a, b) => parseInt((b as File).idx) - parseInt((a as File).idx))

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
          memberImage: (userImage && userImage.uploadedFileURL) || '',
          tags: postHash,
          onSuccess: () => {
            setInputValue('')
            setUploadImage([])
            setFileList(null)
            setPostHash([])
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
          memberImage: (userImage && userImage.uploadedFileURL) || '',
          deleted_images: deletedImage,
          tags: postHash,
          onSuccess: () => {
            setInputValue('')
            setUploadImage([])
            setFileList(null)
            setPostHash([])
            setPostCategory(undefined)
            if (props.onSubmit) props.onSubmit()
          }
        }
      })
  }, [uploadImage, inputValue, postCategory, postHash])
    

  const removeImage = (clickedImage: PostImageType, idx?: number) => {
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
      setDeletedImage([ ...deletedImage, props.post.images[idx]])
    }
  }

  useEffect(() => {
    if (props.post) {
      const category = selectArray.find(v => v.value === props.post.category_code)

      onInputContent(props.post.contents)
      if (props.post.tags && props.post.tags.length > 0) setPostHash(props.post.tags)
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
          .then((data: File) => {
            return setUploadImage((prev) => [...prev, { image: image, url: data, lastModified: image.lastModified }])
          }
      )})
    }
  }, [fileList])

  useEffect(() => {
    if (!props.modify) {
      const category = selectArray.find(v => v.value === globalCategory)
      
      setPostCategory(category)
    }
  }, [globalCategory])

  return (
    <form
      className={ classNames(style.InputPost,
        props.additionalClass,
        props.modify && style.ModifyPost,
        props.popup && style.PopupPost,
        !mobile && style.DesktopInputPost
      ) }
      encType="multipart/form-data"
    >
      <div className={ style.InputFormContainer }>
        { !props.modify && <UserProfile
          size="xs"
          profileImage={ userImage ? userImage.uploadedFileURL : '' }
        /> }
        <div className={ style.PostTextForm }>
          <Textarea
            block
            borderless
            paddingless
            row={ props.row || props.modify ? 5 : 1 }
            fixedHeight={ props.modify ? true : false }
            value={ inputValue }
            additionalClass={ style.InputForm }
            onInput={ (v: string) => onInputContent(v) }
            placeholder={ props.placeholder }
            maxLength={ 5000 }
          />
          <div className={ style.PostLength }>
            <span className={ inputValue.length >= 5000 ? style.MaxLength : '' }>
              { FormatNumber(inputValue.length) + ' ' }
            </span>
            / 5,000
          </div>
        </div>
      </div>
      <div className={ style.PostHashTag }>
        <InputHashTag
          inputHash={ inputHash }
          hashList={ postHash }
          setList={ (v) => setPostHash(v) } 
          setInput={ (v) => setInputHash(v) }
        />
      </div>
      <div className={ style.InputPostAction }>
        <div className={ mobile ? style.MobileCategory : '' }>
          { !props.modify && <SelectBox
            width={ 96 }
            placeholder="카테고리"
            value={ postCategory }
            items={ selectArray }
            style={ SelectboxStyle }
            onClick={ (v) => setPostCategory(v) }
          /> }
        </div>
        <div>
          <Button type="icon" onClick={ (e) => onClickImageUpload(e) }>
            <img src="/images/image-upload.svg" tabIndex={-1} />
          </Button>
          { props.modify && <Button
            type="round"
            theme="gray"
            onClick={ props.onSubmit }
            additionalClass={ style.CancelButton }
          >
            취소
          </Button> }
          <Button
            type="round"
            theme="primary"
            disabled={ inputValue.length === 0 || (props.modify ? modifyLoading : addLoading) }
            onClick={ () => onSubmitPost() }
            additionalClass={ style.PostSubmitButton }
          >
            { props.modify ? '수정' : '등록' }
          </Button>
        </div>
      </div>
      <div className={ classNames( style.PostImageContainer, mobile && style.MobileGrid ) }>
        { postImage.map((v, i) => (
          <div className={ style.PostImage } key={ `post-${i}` }>
            <div className={ style.RemovePostImage } onClick={ () => removeImage(v, i) }>
              &times;
            </div>
            <img src={ v.url } />
          </div>
        )) }
        { uploadImage.map((v, i) => (
          <div className={ style.PostImage } key={ i }  style={{ order: parseInt(v.image.idx) }}>
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