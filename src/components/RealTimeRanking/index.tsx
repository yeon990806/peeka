import { useEffect, useMemo, useState } from "react"
import style from "./style.module.scss"
import classnames from "classnames"
import { useDispatch, useSelector } from "react-redux";
import { FETCH_CURATOR_REQUEST } from "@/store/reducer/content";
import { StateType } from "@/common/defines/Store";
import { CategoryType } from "@/common/defines/Category";

const RealTimeRanking = () => {
  const dispatch = useDispatch()
  const curatorList = useSelector((state: StateType) => state.content.curatorList)
  const category = useSelector((state: StateType) => state.post.postCategory)
  const [page, setPage] = useState<number>(1);
  
  const nextButtonStyle = useMemo(() => ({ transform: 'rotate(180deg)' }), [])

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
    <div className={ style.RealTimeRanking }>
      <header className={ style.RealTimeRankingHeader }>
        <h1>
          <span>
            추천 큐레이터
          </span>
        </h1>
      </header>
      <ul className={ style.RealTimeRankingList }>
        { curatorList.map(curator => (
          <li 
            className={ style.RealTimeRankingItem }
            key={ curator.id }
          >
            {/* <div className={ classnames(style.ItemRanking, i + 1 <= 3 ? style.TopRanking : "") }>
              { i + 1 }
            </div> */}
            <a href={ curator.source } className={ style.RankingContent }>
              { curator.nickname }
            </a>
            {/* <div className={ style.TrendingChange }>
            </div> */}
          </li>
        )) }
      </ul>
    </div>
  )
}

export default RealTimeRanking