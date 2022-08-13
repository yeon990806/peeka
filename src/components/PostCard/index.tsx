import { getLongDateFormat } from '@/common/defines/Format';
import { ActionContentType, PostType, StateType, StorePostType } from "@/common/defines/Store";
import { PopupItemProps } from '@/components/MenuPopup';
import { IsDesktop } from "@/common/hooks/breakpoints";
import { FETCH_COMMENT_REQUEST } from '../../store/reducer/comment';
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import classnames from "classnames"
import Button from "../Button";
import CommentCard from "../CommentCard";
import DeletePostPopup from "./components/DeletePostPopup";
import ImageSlide from "../ImageSlide";
import InputComment from "../InputComment";
import UserProfile from "../UserProfile";
import MenuPopup from "../MenuPopup";
import ReportPopup from "./components/ReportPopup";

import style from "./style.module.scss"
import { LIKE_CONTENT_REQUEST, SCRAP_CONTENT_REQUEST, UNLIKE_CONTENT_REQUEST, UNSCRAP_CONTENT_REQUEST } from '@/store/reducer/reaction';
import UpdatePostPopup from './components/UpdatePostPopup';
interface PostProps {
  post: PostType,
  type: StorePostType,
}

const PostCard = (props: PostProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const userInfo = useSelector((state: StateType) => (state.user.userInfo))
  const desktop = IsDesktop()
  const postLink = useRef(`${ location.origin }/community/${ props.post.id }`)

  const [displayReportPopup, setDisplayReportPopup] = useState<boolean>(false)
  const [displayUpdatePopup, setDisplayUpdatePopup] = useState<boolean>(false)
  const [displayDeletePopup, setDisplayDeletePopup] = useState<boolean>(false)
  const [displayCommentContainer, setDisplayCommentContainer] = useState<boolean>(false)
  const [postMenuList, setPostMenuList] = useState<PopupItemProps[]>()

  const hashtagRegexp = new RegExp(/#[^\s#]+/g)

  const toggleDisplayReportPopup = useCallback(() => setDisplayReportPopup(prev => !prev), [displayReportPopup])
  const toggleDisplayUpdatePopup = useCallback(() => setDisplayUpdatePopup(prev => !prev), [displayUpdatePopup])
  const toggleDisplayDeletePopup = useCallback(() => setDisplayDeletePopup(prev => !prev), [displayDeletePopup])

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
      type: props.post.like_yn == 'Y' ? UNLIKE_CONTENT_REQUEST : LIKE_CONTENT_REQUEST,
      data: {
        type: 'post',
        postId: props.post.id,
        postType: props.type
      }
    })
  
  const toggleClippingPost = () => dispatch({
    type: props.post.scrap_yn == 'Y' ? UNSCRAP_CONTENT_REQUEST : SCRAP_CONTENT_REQUEST,
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
          onClick: () => toggleDisplayUpdatePopup()
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
      <UpdatePostPopup
        post={ props.post }
        display={ displayUpdatePopup }
        onPrev={ toggleDisplayUpdatePopup }
      />
      <DeletePostPopup
        postId={ props.post.id }
        display={ displayDeletePopup }
        onPrev={ () => toggleDisplayDeletePopup() }
      />
      <div className={ classnames(style.Post, desktop && style.DeskPost) }>
        <div className={ style.PostContentContainer }>
          <div className={ style.PostHeader }>
            <div
              className={ style.PostInfoContainer }
              onClick={ () => getUserPost() }
            >
              <UserProfile
                size="sm"
              />
              <div className={ style.PostInfo }>
                <h1>
                  { props.post.nickname }
                </h1>
                <p>
                  <span className={ style.PostCategory }>
                    { props.post.category }
                  </span>
                  <span className={ style.Bar } />
                  <span className={ style.PostTimeDate }>
                    { getLongDateFormat(props.post.created_at) }
                  </span>
                </p>
              </div>
            </div>
            <MenuPopup
              type="icon"
              theme="gray"
              menuList={ postMenuList }
            >
              <img role="presentation" src="/images/more.svg" alt="more" tabIndex={-1} />
            </MenuPopup>
          </div>
          <article className={ style.PostContent }>
            { props.post.contents.split("\n").map((line, idx) => (
              <div key={ `${props.post.id}-${idx}` }>
                {line}
              </div>
            )) }
          </article>
        </div>
        <div className={ style.ImageContainer }>
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
        </div>
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