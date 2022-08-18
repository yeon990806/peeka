import { memo, ReactNode, useMemo } from "react"
import { PostType, StorePostType } from "@/common/defines/Store"
import PostContainer from "../PostContainer"
import Loader from "../Loader"

import style from './style.module.scss'

interface ExtraPageProps {
  img: ReactNode
  imgRotate?: boolean
  title: string
  postList: PostType[]
  fetchDone: boolean
  fetchLoading: boolean
  fetchPost: () => void
  postType: StorePostType
  nullText: string | ReactNode
}

const ExtraPage = memo((props: ExtraPageProps) => {
  const ImageStyle = useMemo(() => ({
    transform: 'rotate(8deg)'
  }), [])

  return (
    <div className={ style.ExtraPage }>
      <div className={ style.ExtraPageHeader }>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={ props.imgRotate && ImageStyle }
          >
            { props.img }
          </svg>
        <h1>
          { props.title }
        </h1>
      </div>
      <div className={ style.ExtraPagePost }>
        { (props.postList && props.postList.length > 0)
          ? <PostContainer
            postList={ props.postList }
            fetchDone={ props.fetchDone }
            fetchLoading={ props.fetchLoading }
            fetchList={ props.fetchPost }
            postType={ props.postType }
          />
          : <div className={ style.ExtraPageNullContent }>
            { props.nullText }
          </div>
        }
        { props.fetchLoading && <Loader  /> }
      </div>
    </div>
  )
})

export default memo(ExtraPage)