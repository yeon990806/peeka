import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADD_COMMENT_REQUEST } from '@/store/reducer/comment';
import { ADD_REPLY_REQUEST } from '../../store/reducer/reply';
import Button from "../Button";
import Textarea from "../Textarea";
import style from "./style.module.scss"
import { StateType, StorePostType } from "@/common/defines/Store";
import { FormatNumber } from "@/common/libs/Format";

interface InputCommentProps {
  onSubmit?: () => void;
  postId: number;
  author: number;
  toUserName?: string;
  placeholder?: string;
  replyMode?: boolean;
  commentId?: number;
  type: StorePostType;
  callback?: () => void
}

const InputComment = (props: InputCommentProps) => {
  const dispatch = useDispatch()
  const useImage = useSelector((state: StateType) => state.user.userInfo.image)
  const addCommentLoading = useSelector((state: StateType) => state.comment.addCommentLoading)
  const addReplyLoading = useSelector((state: StateType) => state.reply.addReplyLoading)
  const [inputValue, setInputValue] = useState<string>('')

  const onInputContent = useCallback((v: string) => setInputValue(v), [inputValue])
  const onSubmitComment = useCallback(() => {
    if (props.replyMode) {
      dispatch({
        type: ADD_REPLY_REQUEST,
        data: {
          memberImage: (useImage && useImage.uploadedFileURL) || "",
          postId: props.postId,
          commentId: props.commentId,
          contents: inputValue,
          author: props.author,
          toUserName: props.toUserName ? props.toUserName : '',
          postType: props.type,
          onSuccess: () => {
            onInputContent('')
            if (props.callback) props.callback()
          }
        }
      })
    } else {
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: {
          memberImage: (useImage && useImage.uploadedFileURL) || "",
          postId: props.postId,
          contents: inputValue,
          author: props.author,
          postType: props.type,
          onSuccess: () => {
            onInputContent('')
            if (props.callback) props.callback()
          }
        }
      })
    }
  }, [inputValue])

  return <form
    className={ style.InputComment }
    encType="application/x-www-form-urlencoded"
  >
    <div className={ style.InputFormContainer }>
      <div className={ style.TextForm }>
        <Textarea
          block
          borderless
          paddingless
          row={ 1 }
          placeholder={ props.placeholder }
          maxLength={ 2000 }
          value={ inputValue }
          additionalClass={ style.InputForm }
          onInput={ (v: string) => onInputContent(v) }
        />
        <div className={ style.CommentLength }>
          <span className={ inputValue.length >= 2000 ? style.MaxLength : '' }>
            { FormatNumber(inputValue.length) + ' ' }
          </span>
          / 2,000
        </div>
      </div>
      <Button
        type="text"
        theme="light"
        onClick={ () => onSubmitComment() }
        disabled={ props.replyMode ? addReplyLoading : addCommentLoading }
      >
        { props.commentId ? '답글' : '댓글' }
      </Button>
    </div>
  </form>
}

export default InputComment