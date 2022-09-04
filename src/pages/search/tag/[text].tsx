import { LayoutType } from "../../_app"
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { EMPTY_EXTRA_LIST, FETCH_EXTRAPOST_REQUEST } from "@/store/reducer/extra";
import { StateType, StorePostType } from "@/common/defines/Store";
import ExtraPage from "@/components/ExtraPage";

const search = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const text = router.query.text || ''

  const searchContent = useSelector((state: StateType) => state.extra.extraList)
  const searchLoading = useSelector((state: StateType) => state.extra.fetchExtraListRequest)
  const searchDone = useSelector((state: StateType) => state.extra.fetchDone)
  const searchError = useSelector((state: StateType) => state.extra.fetchExtraListError)

  const fetchSearchContent = () => {
    if (!text) return

    dispatch({
      type: FETCH_EXTRAPOST_REQUEST,
      data: {
        type: 'tag',
        id: searchContent.length > 0 ? searchContent[searchContent.length - 1].id : '',
        public: true,
        tag: text,
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
  }, [text])
  
  return (
    <ExtraPage
      img={
        <>
          <circle cx="11" cy="11" r="7" stroke="#FFF200" strokeWidth="1.7"/>
          <path d="M20 20L16 16" stroke="#FFF200" strokeWidth="1.7" strokeLinecap="round"/>
        </>
      }
      title={`#${ text } 검색 결과`}
      postList={ searchContent }
      fetchDone={ searchDone }
      fetchLoading={ searchLoading }
      fetchError={ searchError }
      fetchPost={ fetchSearchContent }
      postType={ StorePostType.ExtraPost }
      nullText="검색 결과가 없어요."
    />
  )
}

search.getLayout = LayoutType.App

export default search