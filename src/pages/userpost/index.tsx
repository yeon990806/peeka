import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { StateType } from '@/common/defines/Store';
import { useEffect, useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/Spinner";
import { USER_POST_REQUEST } from "@/store/reducer/user";
import PostContainer from "@/components/PostContainer";

interface userpostProps {
  userId?: number
}

const userpost = (props: userpostProps) => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const userPostData = useSelector((state: StateType) => state.user.userPost)
  const userPostLoading = useSelector((state: StateType) => state.user.userPostLoading)

  const ImageStyle = useMemo(() => ({
    transform: 'rotate(12deg)'
  }), [])

  const fetchUserPost = () => dispatch({
    type: USER_POST_REQUEST,
    data: {
      memberId: props.userId || userInfo.id,
      postId: userPostData.length > 0 ? userPostData[userPostData.length - 1].id : ''
    }
  })

  useEffect(() => {
    if (userInfo.id) () => fetchUserPost()
  }, [userInfo])
  
  if (!userInfo) return null
  return (
    <div className={ style.MyPost }>
      <div className={ style.PageHeader }>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={ ImageStyle }>
          <path d="M4 20L3.81092 16.9747C3.37149 9.94376 8.95536 4 16 4V4L14.7827 4.97387C12.3918 6.88656 11 9.78237 11 12.8442V12.8442C11 14.9831 9.02784 16.5774 6.93642 16.1292L4 15.5" stroke="#FFF200" fill="#FFF200" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1>
          내 포스트
        </h1>
      </div>
      <div className={ style.PostContainer }>
        { (userPostData && userPostData.length > 0)
          ? <PostContainer
            postList={ userPostData }
            fetchLoading={ userPostLoading }
            fetchList={ fetchUserPost }
          />
          : <div className={ style.NullContent }>
            <h1>작성한 포스트가 없어요.</h1>
            <p>포스트를 작성해보세요!</p>
          </div>
        }
        { userPostLoading && <Spinner /> }
      </div>
    </div>
  )
}

userpost.getLayout = LayoutType.App

export default userpost