import { LayoutType } from "../_app"
import { StateType, StorePostType } from '@/common/defines/Store';
import {  useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_EXTRAPOST_REQUEST } from "@/store/reducer/extra";
import ExtraPage from "@/components/ExtraPage";
import UserProfile from "@/components/UserProfile";

const userpost = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [id] = router.query.params || []

  const userPost = useSelector((state: StateType) => state.extra.extraList)
  const userInfo = useSelector((state: StateType) => state.extra.extraUserInfo)
  const userPostLoading = useSelector((state: StateType) => state.extra.fetchExtraListRequest)
  const userPostError = useSelector((state: StateType) => state.extra.fetchExtraListError)
  const userDone = useSelector((state: StateType) => state.extra.fetchDone)

  const fetchUserPost = () => {
    if (!id) return

    dispatch({
      type: FETCH_EXTRAPOST_REQUEST,
      data: {
        type: 'member',
        id: userPost.length > 0 ? userPost[userPost.length - 1].id : '',
        public: true,
        memberId: id,
      }
    })
  }

  useEffect(() => {
    fetchUserPost()

    return () => {
      fetchUserPost()
    }
  }, [])

  useEffect(() => {
    fetchUserPost()
  }, [id])

  if (!userInfo) return null
  return (
    <ExtraPage
      img={
        <UserProfile
          profileImage={ userInfo.image && userInfo.image.uploadedFileURL || '' }
          size="xxs"
          userMembership
        />
      }
      userProfile
      title={ `${ userInfo.nickname || "" }님의 포스트` }
      postList={ userPost }
      fetchDone={ userDone }
      fetchError={ userPostError }
      fetchLoading={ userPostLoading }
      fetchPost={ fetchUserPost }
      postType={ StorePostType.ExtraPost }
      nullText="작성한 포스트가 없어요."
    />
  )
}

userpost.getLayout = LayoutType.App

export default userpost