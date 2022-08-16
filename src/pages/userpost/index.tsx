import { LayoutType } from "../_app"
import { StateType, StorePostType } from '@/common/defines/Store';
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_POST_REQUEST } from "@/store/reducer/user";
import ExtraPage from "@/components/ExtraPage";

const userpost = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const userPostData = useSelector((state: StateType) => state.user.userPost)
  const userPostLoading = useSelector((state: StateType) => state.user.userPostLoading)
  const userDone = useSelector((state: StateType) => state.user.fetchDone)

  const ImageStyle = useMemo(() => ({
    transform: 'rotate(8deg)'
  }), [])

  const fetchUserPost = () => {
    dispatch({
      type: USER_POST_REQUEST,
      data: {
        memberId: userInfo.id,
        postId: userPostData.length > 0 ? userPostData[userPostData.length - 1].id : '',
      }
    })
  }

  useEffect(() => {
    if (userInfo.id) fetchUserPost()
  }, [userInfo])
  
  if (!userInfo) return null
  return (
    <ExtraPage
      img={
        <path d="M4 20L3.81092 16.9747C3.37149 9.94376 8.95536 4 16 4V4L14.7827 4.97387C12.3918 6.88656 11 9.78237 11 12.8442V12.8442C11 14.9831 9.02784 16.5774 6.93642 16.1292L4 15.5" stroke="#FFF200" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      }
      imgRotate
      title="내 포스트"
      postList={ userPostData }
      fetchDone={ userDone }
      fetchLoading={ userPostLoading }
      fetchPost={ fetchUserPost }
      postType={ StorePostType.UserPost }
      nullText={
        <>
          <h1>작성한 포스트가 없어요.</h1>
          <p>포스트를 작성해보세요!</p> 
        </>
      }
    />
  )
}

userpost.getLayout = LayoutType.App

export default userpost