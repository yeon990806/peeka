import { useEffect, useMemo, useState } from "react"
import style from "./style.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { FETCH_CURATOR_REQUEST } from "@/store/reducer/content";
import { StateType } from "@/common/defines/Store";
import { CategoryType } from "@/common/defines/Category";

const CuratorList = () => {
  const dispatch = useDispatch()
  const curatorList = useSelector((state: StateType) => state.content.curatorList)
  const category = useSelector((state: StateType) => state.post.postCategory)

  useEffect(() => {
    dispatch({
      type: FETCH_CURATOR_REQUEST,
      data: {
        category: category === CategoryType.전체 ? '' : category,
        id: curatorList.length > 0 ? curatorList[0].id : ''
      }
    })
  }, [category])

  return (
    <div className={ style.CuratorListContainer }>
      <div className={ style.CuratorList }>
        <header className={ style.CuratorHeader }>
          <h1>
            <span>
              파트너 큐레이터
            </span>
          </h1>
        </header>
        <ul className={ style.CuratorListContent }>
          { curatorList.map(curator => (
            <li 
              className={ style.Curator }
              key={ curator.id }
            >
              {/* <div className={ classnames(style.ItemRanking, i + 1 <= 3 ? style.TopRanking : "") }>
                { i + 1 }
              </div> */}
              <a href={ curator.source } className={ style.RankingContent }>
                { curator.nickname.replace('@', '') }
              </a>
              {/* <div className={ style.TrendingChange }>
              </div> */}
            </li>
          )) }
        </ul>
      </div>
    </div>
  )
}

export default CuratorList