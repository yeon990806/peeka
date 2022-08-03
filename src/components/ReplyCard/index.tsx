import { ReplyType } from '@/common/defines/Store'
import Button from '../Button'
import UserProfile from '../UserProfile'
import style from './style.module.scss'
import MenuPopup from '../MenuPopup';
import { useCallback, useState } from 'react';
import Textarea from '../Textarea';
import { DELETE_REPLY_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, UPDATE_REPLY_REQUEST } from '@/store/reducer/post';
import { useDispatch } from 'react-redux';
import Popup from '../Popup';
import InputComment from '../InputComment';

interface ReplyCardProps {
  data: ReplyType
  postAuthor: number
  commentUser: string
  postId: number
}

const ReplyCard = (props: ReplyCardProps) => {
  const dispatch = useDispatch()
  const [activeModify, setActiveModify] = useState<boolean>(false)
  const [activeReply, setActiveReply] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(props.data.contents)
  const [displayDeleteReply, setDisplayDeleteReply] = useState<boolean>(false)

  const menuList = [
    {
      text: '수정',
      onClick: () => toggleActiveModify()
    },
    {
      text: '삭제',
      onClick: () => toggleDeleteReply()
    }
  ]

  const toggleActiveModify = useCallback(() => setActiveModify(prev => !prev), [activeModify])
  const toggleDeleteReply = useCallback(() => setDisplayDeleteReply(prev => !prev), [displayDeleteReply])
  const toggleActiveReply = useCallback(() => setActiveReply(prev => !prev), [activeReply])

  const onChangeInputValue = useCallback((v: string) => {
    setInputValue(v)
  }, [inputValue])

  const onCancelModify = useCallback(() => {
    setInputValue(props.data.contents)
    toggleActiveModify()
  }, [inputValue])

  const onClickSubmit = useCallback(() => {
    if (inputValue.length > 0) {
      dispatch({
        type: UPDATE_REPLY_REQUEST,
        data: {
          postId: props.postId,
          commentId: props.data.comment_id,
          id: props.data.id,
          contents: inputValue,
          onSuccess: () => setInputValue('')
        }
      })   
    } else toggleDeleteReply()
  }, [inputValue])

  const onDeleteReply = useCallback(() => dispatch({
    type: DELETE_REPLY_REQUEST,
    data: {
      id: props.data.id,
      postId: props.postId,
      commentId: props.data.comment_id,
      onSuccess: () => setDisplayDeleteReply(false)
    }
  }), [])

  const onClickLikeButton = useCallback(() => {
    const data = {
      type: 'reply',
      postId: props.postId,
      commentId: props.data.comment_id,
      id: props.data.id,
    }

    if (props.data.like_yn === 'Y')
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data
      })
    else
      dispatch({
        type: LIKE_POST_REQUEST,
        data
      }) 
  }, [props.data.like_yn, props.data.like_count])

  return (
    <div className={ style.CommentCard }>
      <Popup
        display={ displayDeleteReply }
        type="confirm"
        buttonAlign="right"
        content="답글을 삭제하시겠습니까?"
        onCancel={ () => setDisplayDeleteReply(false) }
        onClick={ () => onDeleteReply() }
      />
      <UserProfile size='xs' />
      <div className={ style.CommentCardContent }>
        <div className={ style.CommentCardInfoContainer }>
          <div className={ style.CommentCardInfo }>
            <h2 className={ style.CommentCardAuthor }>
              { props.data.nickname }
            </h2>
            {/* <p className={ style.CommentCardDate }>
              { getLongDateFormat(props.data.created_at) }
            </p> */}
          </div>
          <MenuPopup menuList={ menuList } theme="light">
            <img src="/images/more.svg" tabIndex={-1} />
          </MenuPopup>
        </div>
        { !activeModify
          ? <article className={ style.CommentCardText }>
            { props.data.member_id !== props.postAuthor && <div className={ style.ReplyChip }>
              { props.commentUser }
            </div> }
            { props.data.contents }
          </article>
          : <div className={ style.CommentInput }>
            <Textarea
              value={ inputValue }
              row={ 3 }
              onInput={ (v) => onChangeInputValue(v) }
            />
            <div className={ style.CommentInputButton }>
              <Button
                type="text"
                size="sm"
                theme="light-gray"
                block
                onClick={ () => onCancelModify() }
              >
                취소
              </Button>
              <Button
                type="text"
                size="sm"
                theme="primary"
                block
                onClick={ () => onClickSubmit() }
              >
                저장
              </Button>
            </div>
          </div>
        }
        <div className={ style.CommentCardAction }>
          <Button type="text" theme="light-gray" onClick={ () => onClickLikeButton() }>
            <img src={`/images/favorite-${ props.data.like_yn === 'Y' ? 'fill' : 'none' }.svg`} tabIndex={-1} />
            <span>
              { props.data.like_count }
            </span>
          </Button>
          <Button type="text" theme="light-gray" onClick={ () => {
            toggleActiveReply()
          } }>
            { activeReply
              ? "답글취소"
              : "답글달기"
            }
          </Button>
        </div>
        { activeReply && <div className={ style.InputReply }>
          <InputComment
            postId={ props.postId }
            commentId={ props.data.comment_id }
            author={ props.data.member_id }
            placeholder="답글을 입력해주세요."
            replyMode={ true }
          />
        </div> }
      </div>
    </div>
  )
}

export default ReplyCard