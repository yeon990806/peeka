import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { CommentType, PostType } from '@/common/defines/Store';
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { getCookie } from '@/common/libs/Cookie';
import PostContainer from "@/components/PostContainer";

const search = () => {
  const router = useRouter()
  const [category, text] = router.query.params || []

  const [mounted, setMounted] = useState<boolean>(false)
  const [searchContent, setSearchContent] = useState<PostType[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
 
  const fetchSearchContent = async (init?: boolean) => {
    if (!category && !text) return
    
    setSearchLoading(true)
    
    try {
      const result = await axios.get(`/api/public/board/post/search?category_code=${ category !== 'ALL' ? category : '' }&search_contents=${ text }&id=${ searchContent.length > 0 ? searchContent[0].id : '' }&paging_number=0&paging_size=20`, {
        headers: {
          Authorization: `Bearer ${ getCookie('accessToken') }`
        }
      })

      if (init) setSearchContent(result.data)
      else setSearchContent([...searchContent, ...result.data])
    } catch (err) {
      setSearchContent([])
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    if (mounted) fetchSearchContent(true)
  }, [mounted])

  useEffect(() => {
    fetchSearchContent(false)
  }, [category, text])
  
  return (
    <div className={ style.MyPost }>
      <div className={ style.PageHeader }>
        <img src="/images/search.svg" tabIndex={-1} role="presentation" />
        <h1>
          검색 결과
        </h1>
      </div>
      <div className={ style.PostContainer }>
        { (searchContent && searchContent.length > 0)
          ? <PostContainer
            postList={ searchContent }
            fetchLoading={ searchLoading }
            fetchList={ () => fetchSearchContent(false) }
          />
          : <div className={ style.NullContent }>
            <h1>검색 결과가 없어요.</h1>
          </div>
        }
        { searchLoading && <Spinner /> }
      </div>
    </div>
  )
}

search.getLayout = LayoutType.App

export default search