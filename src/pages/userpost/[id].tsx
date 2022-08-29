import { LayoutType } from "../_app"
import { StateType, StorePostType } from '@/common/defines/Store';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RESET_USER_POST, USER_POST_REQUEST } from "@/store/reducer/user";
import ExtraPage from "@/components/ExtraPage";
import UserProfile from "@/components/UserProfile";
import { useRouter } from "next/router";

const userpost = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id || ""
  const userInfo = useSelector((state: StateType) => state.user.userPostInfo)
  const userPostData = useSelector((state: StateType) => state.user.userPost)
  const userPostLoading = useSelector((state: StateType) => state.user.userPostLoading)
  const userPostError = useSelector((state: StateType) => state.extra.fetchExtraListError)
  const userDone = useSelector((state: StateType) => state.user.fetchDone)

  const fetchUserPost = () => {
    dispatch({
      type: USER_POST_REQUEST,
      data: {
        memberId: id,
        postId: userPostData.length > 0 ? userPostData[userPostData.length - 1].id : '',
      }
    })
  }

  useEffect(() => {

    if (id) fetchUserPost()

    return () => {
      dispatch({
        type: RESET_USER_POST,
      })
    }
  }, [id])
  
  if (!userInfo) return null
  return (
    <ExtraPage
      img={
        <UserProfile
          profileImage={ userInfo.image && "uploadedFileURL" in userInfo.image ? userInfo.image.uploadedFileURL : '' }
          size="xs"
          userMembership={ userInfo.member_code === 'CR' }
        />
      }
      userProfile
      title={ `${ userInfo.nickname }` }
      postList={ userPostData }
      fetchDone={ userDone }
      fetchError={ userPostError }
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