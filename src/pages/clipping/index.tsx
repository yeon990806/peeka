import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { PostType, StateType, StorePostType } from '@/common/defines/Store';
import { useCallback, useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { IsMobile } from "@/common/hooks/breakpoints";
import Spinner from "@/components/Spinner";
import { CLIPPING_POST_REQUEST } from "@/store/reducer/user";
import produce from "immer";

const clipping = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const clippingPost = useSelector((state: StateType) => state.user.clippingPost)
  const clippingPostLoading = useSelector((state: StateType) => state.user.clippingPostLoading)

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    if (mounted) dispatch({
      type: CLIPPING_POST_REQUEST,
      data: {
        id: clippingPost.length > 0 ? clippingPost[clippingPost.length - 1].id : ''
      }
    })
  }, [mounted])
  
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
          ? clippingPost.map(v => (
            <PostCard
              post={ v }
              key={ v.id }
              type={ StorePostType.ExtraPost }
            />
          )) 
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