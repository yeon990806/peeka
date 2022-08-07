import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { PostType, StorePostType } from '@/common/defines/Store';
import {  useEffect, useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { getCookie } from '@/common/libs/Cookie';
import axios from 'axios'

const userpost = () => {
  const router = useRouter()
  const [id] = router.query.params || []

  const [mounted, setMounted] = useState<boolean>(false)
  const [userPost, setUserPost] = useState<PostType[]>([])
  const [userPostLoading, setUserPostLoading] = useState<boolean>(false)

  const ImageStyle = useMemo(() => ({
    transform: 'rotate(12deg)'
  }), [])

  const fetchUserPost = async (init: boolean) => {
    if (!id) return

    setUserPostLoading(true)

    try {
      const result = await axios.get(`/api/public/board/post/member?member_id=${ id }&id=${ userPost.length > 0 ? userPost[userPost.length - 1].id : '' }&paging_number=0&paging_size=20`, {
        headers: {
          Authorization: `Bearer ${ getCookie('accessToken') }`
        }
      })

      if (init) setUserPost(result.data)
      else setUserPost([...userPost, ...result.data])
    } catch (err) {
      setUserPost([])
    } finally {
      setUserPostLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    if (mounted) fetchUserPost(true)
  }, [mounted])

  useEffect(() => {
    fetchUserPost(false)
  }, [id])
  
  return (
    <div className={ style.MyPost }>
      <div className={ style.PageHeader }>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={ ImageStyle }>
          <path d="M4 20L3.81092 16.9747C3.37149 9.94376 8.95536 4 16 4V4L14.7827 4.97387C12.3918 6.88656 11 9.78237 11 12.8442V12.8442C11 14.9831 9.02784 16.5774 6.93642 16.1292L4 15.5" stroke="#FFF200" fill="#FFF200" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1>
          작성 포스트 검색
        </h1>
      </div>
      <div className={ style.PostContainer }>
        { (userPost && userPost.length > 0)
          ? userPost.map((v) => (
            <PostCard
              post={ v }
              key={ v.id }
              type={ StorePostType.UserPost }
            />
          )) 
          : <div className={ style.NullContent }>
            <h1>작성한 포스트가 없어요.</h1>
          </div>
        }
        { userPostLoading && <Spinner /> }
      </div>
    </div>
  )
}

userpost.getLayout = LayoutType.App

export default userpost