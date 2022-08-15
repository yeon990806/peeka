import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { StateType, StorePostType } from '@/common/defines/Store';
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/Spinner";
import { EMPTY_EXTRA_LIST, FETCH_EXTRAPOST_REQUEST } from "@/store/reducer/extra";
import PostContainer from "@/components/PostContainer";

const clipping = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const clippingPost = useSelector((state: StateType) => state.extra.extraList)
  const clippingPostLoading = useSelector((state: StateType) => state.extra.fetchExtraListRequest)
  const clippingDown = useSelector((state: StateType) => state.extra.fetchDone)

  const fetchClippingPost = () => dispatch({
    type: FETCH_EXTRAPOST_REQUEST,
    data: {
      type: 'scrap',
      id: clippingPost.length > 0 ? clippingPost[clippingPost.length - 1].id : ''
    }
  })

  useEffect(() => {
    fetchClippingPost()

    return () => {
      dispatch({
        type: EMPTY_EXTRA_LIST
      })
    }
  }, [])
  
  if (!userInfo) return null
  return (
    <div className={ style.Clipping }>
      <div className={ style.PageHeader }>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 9.20055C4.5 6.51328 4.5 5.16965 5.32376 4.33483C6.14752 3.5 7.47335 3.5 10.125 3.5H13.875C16.5267 3.5 17.8525 3.5 18.6762 4.33483C19.5 5.16965 19.5 6.51328 19.5 9.20055V15.6874C19.5 18.2368 19.5 19.5115 18.7085 19.9013C17.9169 20.2912 16.9279 19.5037 14.9499 17.9286L14.3168 17.4245C13.2046 16.5389 12.6485 16.0961 12 16.0961C11.3515 16.0961 10.7954 16.5389 9.68317 17.4245L9.05012 17.9286C7.07207 19.5037 6.08305 20.2912 5.29153 19.9013C4.5 19.5115 4.5 18.2368 4.5 15.6874V9.20055Z" stroke="#FFF200" stroke-width="1.7"/>
      </svg>
        <h1>
          스크랩
        </h1>
      </div>
      <div className={ style.PostContainer }>
        
        { (clippingPost && clippingPost.length > 0)
          ? 
          <PostContainer
            postList={ clippingPost }
            fetchList={ fetchClippingPost }
            fetchDone={ clippingDown }
            fetchLoading={ clippingPostLoading }
            postType={ StorePostType.ExtraPost }
          />
          : <div className={ style.NullContent }>
            <h1>스크랩한 포스트가 없어요.</h1>
            <p>포스트를 스크랩해보세요!</p>
          </div>
        }
        { clippingPostLoading && <Spinner /> }
      </div>
    </div>
  )
}

clipping.getLayout = LayoutType.App

export default clipping