import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { ADD_COMMENT_REQUEST } from '@/store/reducer/comment';
import { ADD_REPLY_REQUEST } from '../../store/reducer/reply';
import Button from "../Button";
import Textarea from "../Textarea";
import style from "./style.module.scss"
import { StorePostType } from "@/common/defines/Store";

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
  const [inputValue, setInputValue] = useState<string>('')

  const onInputContent = useCallback((v: string) => setInputValue(v), [inputValue])
  const onSubmitComment = useCallback(() => {
    if (props.replyMode) {
      dispatch({
        type: ADD_REPLY_REQUEST,
        data: {
          postId: props.postId,
          commentId: props.commentId,
          contents: inputValue,
          author: props.author,
          toUserName: props.toUserName ? props.toUserName : '',
          postType: props.type,
          onSuccess: () => {
            setInputValue('')
            if (props.callback) props.callback()
          }
        }
      })
    } else {
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: {
          postId: props.postId,
          contents: inputValue,
          author: props.author,
          postType: props.type,
          onSuccess: () => {
            setInputValue('')
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
      <Textarea
        block
        borderless
        paddingless
        row={ 1 }
        placeholder={ props.placeholder }
        value={ inputValue }
        additionalClass={ style.InputForm }
        onInput={ (v: string) => onInputContent(v) }
      />
      <Button type="text" theme="light" onClick={ () => onSubmitComment() }>
        { props.commentId ? '답글' : '댓글' }
      </Button>
    </div>
  </form>
}

export default InputComment