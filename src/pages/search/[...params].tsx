import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { useEffect } from "react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import PostContainer from "@/components/PostContainer";
import { useDispatch, useSelector } from "react-redux";
import { EMPTY_EXTRA_LIST, FETCH_EXTRAPOST_REQUEST } from "@/store/reducer/extra";
import { StateType, StorePostType } from "@/common/defines/Store";

const search = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [category, text] = router.query.params || []

  const searchContent = useSelector((state: StateType) => state.extra.extraList)
  const searchLoading = useSelector((state: StateType) => state.extra.fetchExtraListRequest)
  const searchDone = useSelector((state: StateType) => state.extra.fetchDone)

  const fetchSearchContent = () => {
    if (!category && !text) return
    dispatch({
      type: FETCH_EXTRAPOST_REQUEST,
      data: {
        type: 'search',
        id: searchContent.length > 0 ? searchContent[searchContent.length - 1].id : '',
        public: true,
        category,
        text,
      }
    })
  }

  useEffect(() => {
    fetchSearchContent()

    return () => {
      dispatch({
        type: EMPTY_EXTRA_LIST
      })
    }
  }, [])

  useEffect(() => {
    fetchSearchContent()
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
            fetchDone={ searchDone }
            fetchLoading={ searchLoading }
            fetchList={ fetchSearchContent }
            postType={ StorePostType.ExtraPost }
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