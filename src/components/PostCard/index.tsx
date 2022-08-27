import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import { PostType, StateType, StorePostType } from "@/common/defines/Store";
import { PopupItemProps } from '@/components/MenuPopup';
import { TOGGLE_LIKE_REQUEST, TOGGLE_SCRAP_REQUEST } from '@/store/reducer/reaction';
import { IsDesktop } from "@/common/hooks/breakpoints";
import { FETCH_COMMENT_REQUEST } from '../../store/reducer/comment';
import { getTimeFromNow } from '@/common/defines/Format';
import classnames from "classnames"
import Button from "../Button";
import CommentCard from "../CommentCard";
import DeletePostPopup from "./components/DeletePostPopup";
import ImageSlide from "../ImageSlide";
import InputComment from "../InputComment";
import UserProfile from "../UserProfile";
import MenuPopup from "../MenuPopup";
import ReportPopup from "./components/ReportPopup";
import InputPost from '../InputPost';

import style from "./style.module.scss"
interface PostProps {
  post: PostType,
  type: StorePostType,
}

const PostCard = (props: PostProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const desktop = IsDesktop()
  const postLink = useRef(`${ location.origin }/community/${ props.post.id }`)
  const userInfo = useSelector((state: StateType) => (state.user.userInfo))

  const [displayReportPopup, setDisplayReportPopup] = useState<boolean>(false)
  const [displayDeletePopup, setDisplayDeletePopup] = useState<boolean>(false)
  const [activeModify, setActiveModify] = useState<boolean>(false)
  const [displayCommentContainer, setDisplayCommentContainer] = useState<boolean>(props.type === StorePostType.Alert || props.post.display_comment)
  const [postMenuList, setPostMenuList] = useState<PopupItemProps[]>()

  const hashtagRegexp = new RegExp(/#[^\s#]+/g)

  const toggleDisplayReportPopup = useCallback(() => setDisplayReportPopup(prev => !prev), [displayReportPopup])
  const toggleModify = useCallback(() => setActiveModify(prev => !prev), [activeModify])
  const toggleDisplayDeletePopup = useCallback(() => setDisplayDeletePopup(prev => !prev), [displayDeletePopup])

  const getTrendPostText = useCallback(() => {
    if (props.post.like_count <= 50) return <span>떠오르는 포스트</span>
    else if (props.post.like_count <= 300) return '주목해야 할 포스트'
    else if (props.post.comment_count <= 1000) return '화제의 포스트'
    else if (props.post.comment_count >= 3000) return '놓치면 안될 포스트'
  }, [props.post.like_count])

  const getUserPost = useCallback(() => {
    if (router.pathname.indexOf('userpost') < 0 && router.asPath.indexOf(props.post.member_id.toString()) < 0)
      router.push({
        pathname: '/userpost/[id]',
        query: {
          id: props.post.member_id
        }
      })
  }, [props.post.member_id])

  const toggleDisplayComment = useCallback(() => {
    setDisplayCommentContainer(prev => !prev)
    
    if(!displayCommentContainer && !props.post.comment_list) fetchPostComment()
  }, [displayCommentContainer, props.post.comment_list])

  const toggleLikePost = () => dispatch({
      type: TOGGLE_LIKE_REQUEST,
      data: {
        type: 'post',
        postId: props.post.id,
        postType: props.type
      }
    })
  
  const toggleClippingPost = () => dispatch({
    type: TOGGLE_SCRAP_REQUEST,
    data: {
      id: props.post.id,
      postType: props.type,
    },
  })

  const fetchPostComment = () => dispatch({
    type: FETCH_COMMENT_REQUEST,
    data: {
      postId: props.post.id,
      id: props.post.comment_list && props.post.comment_list.length > 0
        ? props.post.comment_list[props.post.comment_list.length - 1].id
        : "",
      postType: props.type,
    }
  })

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: props.post.contents,
        url: postLink.current
      })
    } else {
      navigator.clipboard.writeText(postLink.current).then((res) => {
        alert('링크가 복사되었습니다.')
      })
    }
  }

  useEffect(() => {
    if (props.post.member_id === (userInfo && userInfo.id))
      setPostMenuList([
        {
          text: "링크 복사",
          onClick: () => {}
        },
        {
          text: "수정",
          onClick: () => toggleModify()
        },
        {
          text: "삭제",
          onClick: () => toggleDisplayDeletePopup()
        },
      ])
    else
      setPostMenuList([
        {
          text: "신고",
          onClick: () => toggleDisplayReportPopup()
        },
        {
          text: "링크 복사",
          onClick: () => sharePost()
        },
      ])
  }, [props.post.member_id, userInfo])

  return (
    <>
      <ReportPopup
        postId={ props.post.id }
        display={ displayReportPopup }
        onPrev = { () => toggleDisplayReportPopup() }
      />
      <DeletePostPopup
        postId={ props.post.id }
        postType={ props.type }
        display={ displayDeletePopup }
        onPrev={ () => toggleDisplayDeletePopup() }
      />
      <div className={ classnames(style.Post, desktop && style.DeskPost) }>
        <div className={ style.PostContentContainer }>
          { props.post.like_count >= 50 && <div className={ style.BestPost }>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 20L3.81092 16.9747C3.37149 9.94376 8.95536 4 16 4V4L14.7827 4.97387C12.3918 6.88656 11 9.78237 11 12.8442V12.8442C11 14.9831 9.02784 16.5774 6.93642 16.1292L4 15.5" stroke="#FFF200" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>
              { getTrendPostText() }
            </span>
          </div> }
          <div className={ style.PostHeader }>
            <div
              className={ style.PostInfoContainer }
              onClick={ () => getUserPost() }
            >
              <UserProfile
                profileImage={ props.post.member_image }
                size="sm"
              />
              <div className={ style.PostInfo }>
                <h1>
                  { props.post.nickname.replace('@', '') }
                </h1>
                <p>
                  <span className={ style.PostCategory }>
                    { props.post.category }
                  </span>
                  <span className={ style.Bar } />
                  <span className={ style.PostTimeDate }>
                    { getTimeFromNow(props.post.created_at.toString()) }
                  </span>
                </p>
              </div>
            </div>
            { !activeModify && <MenuPopup
              type="icon"
              theme="gray"
              menuList={ postMenuList }
            >
              <img role="presentation" src="/images/more.svg" alt="more" tabIndex={-1} />
            </MenuPopup> }
          </div>
          { activeModify
            ? <InputPost
              modify
              post={ props.post }
              postType={ props.type }
              onSubmit={ toggleModify }
            />
            : <article className={ style.PostContent }>
              { props.post.contents.split("\n").map((line, idx) => (
                <div key={ `${props.post.id}-${idx}` }>
                  {line}
                </div>
              )) }
            </article>
          }
        </div>
        { !activeModify && <div className={ style.ImageContainer }>
          <ImageSlide
            slideHeight={ 300 }
            imageArray={ props.post.images }
            dots
            infinite
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            arrow
          />
        </div> }
        <div className={ style.PostAction }>
          <div className={ style.PostReaction }>
            <Button type="icon" onClick={ () => toggleLikePost() }>
              <img src={ `/images/favorite${ props.post.like_yn === 'Y' ? '-primary' : '' }.svg` } />
              <span className={ props.post.like_yn === 'Y' ? style.LikedPost : '' }>
                { props.post.like_count }
              </span>
            </Button>
            <Button type="icon" onClick={ () => toggleDisplayComment() }>
              <img src="/images/comment.svg" />
              <span>
                { props.post.comment_count }
              </span>
            </Button>
          </div>
          <div className={ style.PostMenu }>
            <Button type="icon" onClick={ () => toggleClippingPost() }>
              <img src={`/images/bookmark${ props.post.scrap_yn === 'Y' ? '-fill' : '' }.svg`} tabIndex={-1} />
            </Button>
          </div>
        </div>
        { displayCommentContainer &&
          <div className={ style.PostCommentContainer }>
            <div className={ style.InputCommentContainer }>
              <InputComment
                postId={ props.post.id }
                author={ props.post.member_id }
                type={ props.type }
                placeholder="댓글을 입력하세요."
              />
            </div>
            { (props.post.comment_list && props.post.comment_list.length > 0) && <div className={ style.PostCommentList }>
              { props.type === StorePostType.Alert && <div className={ style.AlertComment }>
                  알림 댓글입니다.
                </div> }
              { props.post.comment_list.map(comment => (
                comment.id && <CommentCard
                  data={ comment }
                  key={ comment.id }
                  type={ props.type }
                />
              )) }
              <Button type="text" theme="light-gray" onClick={ () => fetchPostComment() }>
                댓글 더 불러오기
              </Button>
            </div> }
          </div>
        }
      </div>
    </>
  )
}

export default PostCard