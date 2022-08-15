import { ReplyType, StateType, StorePostType } from '@/common/defines/Store'
import Button from '../Button'
import UserProfile from '../UserProfile'
import style from './style.module.scss'
import MenuPopup from '../MenuPopup';
import { useCallback, useState } from 'react';
import Textarea from '../Textarea';
import { useDispatch, useSelector } from 'react-redux';
import Popup from '../Popup';
import InputComment from '../InputComment';
import { DELETE_REPLY_REQUEST, UPDATE_REPLY_REQUEST } from '@/store/reducer/reply';
import { LIKE_CONTENT_REQUEST, UNLIKE_CONTENT_REQUEST } from '@/store/reducer/reaction';

interface ReplyCardProps {
  data: ReplyType
  postAuthor: number
  commentUser: string
  postId: number
  type: StorePostType,
}

const ReplyCard = (props: ReplyCardProps) => {
  const dispatch = useDispatch()
  const userId = useSelector((state: StateType) => state.user.userInfo.id)
  const [activeModify, setActiveModify] = useState<boolean>(false)
  const [activeReply, setActiveReply] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(props.data.contents)
  const [displayDeleteReply, setDisplayDeleteReply] = useState<boolean>(false)

  const atRegex = /@[^\s]+/g
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
          postType: props.type,
          onSuccess: (v) => {
            setInputValue(v)
            toggleActiveModify()
          }
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
      postType: props.type,
      onSuccess: () => setDisplayDeleteReply(false)
    }
  }), [])

  const onClickLikeButton = useCallback(() => {
    const data = {
      type: 'reply',
      postId: props.postId,
      commentId: props.data.comment_id,
      replyId: props.data.id,
      postType: props.type,
    }

    if (props.data.like_yn === 'Y')
      dispatch({
        type: UNLIKE_CONTENT_REQUEST,
        data
      })
    else
      dispatch({
        type: LIKE_CONTENT_REQUEST,
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
      <UserProfile
        size='xs'
        profileImage={ props.data.member_image }
      />
      <div className={ style.CommentCardContent }>
        <div className={ style.CommentCardInfoContainer }>
          <div className={ style.CommentCardInfo }>
            <h2 className={ style.CommentCardAuthor }>
              { props.data.nickname.replace('@', '') }
            </h2>
            {/* <p className={ style.CommentCardDate }>
              { getLongDateFormat(props.data.created_at) }
            </p> */}
          </div>
          { ((userId === props.data.member_id) && !activeModify) && <MenuPopup menuList={ menuList } theme="light">
            <img src="/images/more.svg" tabIndex={-1} />
          </MenuPopup> }
        </div>
        { !activeModify
          ? <article className={ style.CommentCardText }>
            { props.data.contents.match(atRegex) && <div className={ style.ReplyChip }>
              { atRegex.exec(props.data.contents)[0] }
            </div> }
            { props.data.contents.split(/@[^\s]+/g) }
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
            <img src={`/images/favorite-${ props.data.like_yn === 'Y' ? 'primary' : 'none' }.svg`} tabIndex={-1} />
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
            toUserName={ `${ props.data.nickname }` }
            postId={ props.postId }
            commentId={ props.data.comment_id }
            author={ props.data.member_id }
            placeholder="답글을 입력해주세요."
            type={ props.type }
            replyMode
            callback={ () => {
              setActiveReply(false)
            } }
          />
        </div> }
      </div>
    </div>
  )
}

export default ReplyCard