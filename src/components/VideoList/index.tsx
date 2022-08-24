import { useEffect, useMemo, useState } from "react"
import style from "./style.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { FETCH_VIDEO_REQUEST } from "@/store/reducer/content";
import { StateType } from "@/common/defines/Store";
import { CategoryType } from "@/common/defines/Category";

const VideoList = () => {
  const dispatch = useDispatch()
  const category = useSelector((state: StateType) => state.post.postCategory)
  const bannerList = useSelector((state: StateType) => state.content.videoList)

  useEffect(() => {
    if (category)
      dispatch({
        type: FETCH_VIDEO_REQUEST,
        data: {
          category: (category && category === CategoryType.전체) ? '' : category,
          id: '',
          // id: currentList.length > 0 ? currentList[0].id : '' ,
        }
      })
  }, [category])

  return (
    <div className={ style.VideoList }>
      <ul className={ style.VideoItemContainer }>
        { bannerList.map(video => {
          const temp = video.source.replace('https://', '').split('/')
          const videoId = temp[temp.length - 1]
          
          
          return <li 
            className={ style.VideoListItem }
            key={ video.id }
          >
            <a href={ `https://youtu.be/${ videoId }` } target="_blank">
              <div className={ style.VideoTitle }>
                { video.title || "제목을 입력하세요." }
              </div>
              <img src={ `https://img.youtube.com/vi/${ videoId }/mqdefault.jpg` } alt={ "제목을 입력해주세요." } />
            </a>
          </li>
        }) }
      </ul>
    </div>
  )
}

export default VideoList