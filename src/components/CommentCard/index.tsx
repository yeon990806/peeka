import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getLongDateFormat } from '@/common/defines/Format';
import { CommentType, StateType, StorePostType } from '@/common/defines/Store'
import { UPDATE_COMMENT_REQUEST, DELETE_COMMENT_REQUEST } from '@/store/reducer/comment';
import { FETCH_REPLY_REQUEST } from '@/store/reducer/reply';
import Button from '../Button'
import InputComment from '../InputComment';
import UserProfile from '../UserProfile'
import MenuPopup from '../MenuPopup';
import Popup from '../Popup';
import ReplyCard from '../ReplyCard';
import Textarea from '../Textarea';

import style from './style.module.scss'
import { LIKE_CONTENT_REQUEST, UNLIKE_CONTENT_REQUEST } from '@/store/reducer/reaction';

interface CommentCardProps {
  data: CommentType,
  type: StorePostType,
}

const CommentCard = (props: CommentCardProps) => {
  const dispatch = useDispatch()
  const userId = useSelector((state: StateType) => state.user.userInfo.id)
  const addSuccess = useSelector((state: StateType) => state.comment.addCommentLoading)
  const modifySuccess = useSelector((state: StateType) => state.comment.updateCommentSuccess)
  const [activeModify, setActiveModify] = useState<boolean>(false)
  const [activeReply, setActiveReply] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(props.data.contents)
  const [displayDeleteComment, setDisplayDeleteComment] = useState<boolean>(false)
  const [displayReplyList, setDisplayReplyList] = useState<boolean>((props.data.reply_list && props.type) === StorePostType.Alert)

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
      postType: props.type,
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
          postType: props.type,
          onSuccess: (v: string) => {
            onChangeInputValue(v)
            toggleActiveModify()
          }
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
      postType: props.type,
      onSuccess: () => setDisplayDeleteComment(false)
    }
  }), [])

  const onClickLikeButton = useCallback(() => {
    const data = {
      type: 'comment',
      postId: props.data.post_id,
      commentId: props.data.id,
      postType: props.type
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
            <p className={ style.CommentCardDate }>
              { getLongDateFormat(props.data.created_at) }
            </p>
          </div>
          { ((userId === props.data.member_id) && !activeModify) && <MenuPopup menuList={ menuList } theme="light">
            <img src="/images/more.svg" tabIndex={-1} />
          </MenuPopup> }
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
            <img src={`/images/favorite-${ props.data.like_yn === 'Y' ? 'primary' : 'none' }.svg`} tabIndex={-1} />
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
              toUserName={ props.data.nickname }
              postId={ props.data.post_id }
              author={ props.data.member_id }
              placeholder="답글을 입력해주세요."
              replyMode
              commentId={ props.data.id }
              type={ props.type }
              callback={ () => {
                setDisplayReplyList(true)
                toggleActiveReply()
              } }
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