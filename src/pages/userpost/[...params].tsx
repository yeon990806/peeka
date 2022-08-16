import { LayoutType } from "../_app"
import { StateType, StorePostType } from '@/common/defines/Store';
import {  useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_EXTRAPOST_REQUEST } from "@/store/reducer/extra";
import ExtraPage from "@/components/ExtraPage";

const userpost = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [id] = router.query.params || []

  const userPost = useSelector((state: StateType) => state.extra.extraList)
  const userPostLoading = useSelector((state: StateType) => state.extra.fetchExtraListRequest)
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
  
  return (
    <ExtraPage
      img={
        <path d="M4 20L3.81092 16.9747C3.37149 9.94376 8.95536 4 16 4V4L14.7827 4.97387C12.3918 6.88656 11 9.78237 11 12.8442V12.8442C11 14.9831 9.02784 16.5774 6.93642 16.1292L4 15.5" stroke="#FFF200" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      }
      imgRotate
      title="작성 포스트 검색"
      postList={ userPost }
      fetchDone={ userDone }
      fetchLoading={ userPostLoading }
      fetchPost={ fetchUserPost }
      postType={ StorePostType.ExtraPost }
      nullText="작성한 포스트가 없어요."
    />
  )
}

userpost.getLayout = LayoutType.App

export default userpost