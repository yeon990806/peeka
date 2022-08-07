import { CommentType, StateType, StorePostType } from '@/common/defines/Store'
import Button from '../Button'
import UserProfile from '../UserProfile'
import style from './style.module.scss'
import { getLongDateFormat } from '@/common/defines/Format';
import MenuPopup from '../MenuPopup';
import { useCallback, useEffect, useState } from 'react';
import Textarea from '../Textarea';
import { UPDATE_COMMENT_REQUEST, DELETE_COMMENT_REQUEST } from '@/store/reducer/comment';
import { FETCH_REPLY_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST } from '@/store/reducer/post';
import { useDispatch } from 'react-redux';
import Popup from '../Popup';
import { useSelector } from 'react-redux';
import InputComment from '../InputComment';
import ReplyCard from '../ReplyCard';

interface CommentCardProps {
  data: CommentType,
  type: StorePostType,
}

const CommentCard = (props: CommentCardProps) => {
  const dispatch = useDispatch()
  const addSuccess = useSelector((state: StateType) => state.post.addCommentSuccess)
  const modifySuccess = useSelector((state: StateType) => state.post.updateCommentSuccess)
  const [activeModify, setActiveModify] = useState<boolean>(false)
  const [activeReply, setActiveReply] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(props.data.contents)
  const [displayDeleteComment, setDisplayDeleteComment] = useState<boolean>(false)
  const [displayReplyList, setDisplayReplyList] = useState<boolean>(false)

  const menuList = [
    {
      text: '수정',
      onClick: () => toggleActiveModify()
    },
    {
      text: '삭제',
      onClick: () => toggleDeleteComment()
    }
  ]

  const fetchCommentReply = useCallback(() => dispatch({
    type: FETCH_REPLY_REQUEST,
    data: {
      postId: props.data.post_id,
      commentId: props.data.id,
      id: props.data.reply_list ? props.data.reply_list[props.data.reply_list.length - 1].id : '',
      onSuccess: () => onChangeInputValue('')
    }
  }), [props.data.reply_list])

  const toggleActiveModify = useCallback(() => setActiveModify(prev => !prev), [activeModify])
  const toggleDeleteComment = useCallback(() => setDisplayDeleteComment(prev => !prev), [displayDeleteComment])
  const toggleActiveReply = useCallback(() => setActiveReply(prev => !prev), [activeReply])
  const toggleReplyList = useCallback(() => {
    setDisplayReplyList(prev => !prev)

    if (!displayReplyList && !props.data.reply_list) fetchCommentReply()
  }, [displayReplyList, props.data.reply_list])

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
        type: UPDATE_COMMENT_REQUEST,
        data: {
          postId: props.data.post_id,
          id: props.data.id,
          contents: inputValue,
        }
      })   
    } else {
      toggleDeleteComment()
    }
  }, [inputValue])

  const onDeleteComment = useCallback(() => dispatch({
    type: DELETE_COMMENT_REQUEST,
    data: {
      id: props.data.id,
      postId: props.data.post_id,
      onSuccess: () => setDisplayDeleteComment(false)
    }
  }), [])

  const onClickLikeButton = useCallback(() => {
    const data = {
      type: 'comment',
      postId: props.data.post_id,
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

  useEffect(() => { if (addSuccess) onChangeInputValue('') }, [addSuccess])
  useEffect(() => { if (modifySuccess) {
    onChangeInputValue(props.data.contents)
    setActiveModify(false)
  } }, [modifySuccess])

  return (
    <div className={ style.CommentCard }>
      <Popup
        display={ displayDeleteComment }
        type="confirm"
        buttonAlign="right"
        content="댓글을 삭제하시겠습니까?"
        onCancel={ () => setDisplayDeleteComment(false) }
        onClick={ () => onDeleteComment() }
      />
      <UserProfile size='xs' />
      <div className={ style.CommentCardContent }>
        <div className={ style.CommentCardInfoContainer }>
          <div className={ style.CommentCardInfo }>
            <h2 className={ style.CommentCardAuthor }>
              { props.data.nickname }
            </h2>
            <p className={ style.CommentCardDate }>
              { getLongDateFormat(props.data.created_at) }
            </p>
          </div>
          <MenuPopup menuList={ menuList } theme="light">
            <img src="/images/more.svg" tabIndex={-1} />
          </MenuPopup>
        </div>
        { !activeModify
          ? <article className={ style.CommentCardText }>
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
          <Button type="text" theme="light-gray" onClick={ () => toggleActiveReply() }>
            { activeReply
              ? "답글취소"
              : "답글달기"
            }
          </Button>
          <Button type="text" theme="light-gray" onClick={ () => toggleReplyList() }>
            답글 { props.data.reply_count }개
            <img src="/images/expand_more.svg" tabIndex={-1} />
          </Button>
        </div>
        { activeReply && <div className={ style.InputReply }>
            <InputComment
              postId={ props.data.post_id }
              author={ props.data.member_id }
              placeholder="답글을 입력해주세요."
              replyMode={ true }
              commentId={ props.data.id }
              type={ props.type }
            />
          </div> }
        { displayReplyList && <div className={ style.ReplyContainer }>
          { props.data.reply_list && props.data.reply_list.map(reply => (
            <ReplyCard
              data={ reply }
              postId={ props.data.post_id }
              postAuthor={ props.data.member_id }
              commentUser={ props.data.nickname }
              key={ reply.id }
              type={ props.type }
            />
          )) }
          <Button type="text" theme="light-gray" onClick={ () => fetchCommentReply() }>
            답글 더 불러오기
          </Button>
        </div> }
      </div>
    </div>
  )
}

export default CommentCard