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
        <img src="/images/bookmark.svg" role="presentation" alt="bookmark" />
        <h1>
          스크랩한 포스트
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