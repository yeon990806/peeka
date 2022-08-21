import { LayoutType } from "../_app"
import { StateType, StorePostType } from '@/common/defines/Store';
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_POST_REQUEST } from "@/store/reducer/user";
import ExtraPage from "@/components/ExtraPage";
import UserProfile from "@/components/UserProfile";

const userpost = () => {
  const dispatch = useDispatch()
  const initUserInfo = useSelector((state: StateType) => state.user.userInfo)
  const userInfo = useSelector((state: StateType) => state.user.userPostInfo)
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
        memberId: initUserInfo.id,
        postId: userPostData.length > 0 ? userPostData[userPostData.length - 1].id : '',
      }
    })
  }

  useEffect(() => {
    if (initUserInfo.id) fetchUserPost()
  }, [initUserInfo])
  
  if (!userInfo) return null
  return (
    <ExtraPage
      img={
        <UserProfile
          profileImage={ userInfo.image.uploadedFileURL || '' }
          size="xxs"
          userMembership
        />
      }
      userProfile
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