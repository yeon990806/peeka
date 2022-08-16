import { useEffect, useMemo, useState } from "react"
import style from "./style.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { FETCH_VIDEO_REQUEST } from "@/store/reducer/content";
import { StateType } from "@/common/defines/Store";
import { CategoryType } from "@/common/defines/Category";

const VideoList = () => {
  const dispatch = useDispatch()
  const category = useSelector((state: StateType) => state.post.postCategory)
  const currentList = useSelector((state: StateType) => {
    switch (category) {
      case CategoryType.전체:
        return state.content.allVideoList
      case CategoryType.영화:
        return state.content.movieVideoList
      case CategoryType.시리즈:
        return state.content.seriesVideoList
      case CategoryType.웹툰:
        return state.content.toonVideoList
      case CategoryType.웹소설:
        return state.content.novelVideoList
    }
  })

  useEffect(() => {
    dispatch({
      type: FETCH_VIDEO_REQUEST,
      data: {
        category: category === CategoryType.전체 ? '' : category,
        id: '',
        // id: currentList.length > 0 ? currentList[0].id : '' ,
      }
    })
  }, [category])

  return (
    <div className={ style.VideoList }>
      <ul className={ style.VideoItemContainer }>
        { currentList.map(video => (
          <li 
            className={ style.VideoListItem }
            key={ video.id }
          >
            <iframe
              width="320"
              height="180"
              src={ video.source }
              title={ video.id.toString() }
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
              </iframe>
          </li>
        )) }
      </ul>
    </div>
  )
}

export default VideoList