import { useMemo, useState } from "react"
import style from "./style.module.scss"
import classnames from "classnames"

const RealTimeRanking = () => {
  const [page, setPage] = useState<number>(1);
  const [rankingList, setRankingList] = useState<string[]>(["호랑이 형님", "신의 탑", "두번사는 랭커", "신도림", "외모지상주의", "갓오브하이스쿨", "나노머신", "투신전생기", "화산쉬환", "초인의 시대"]);

  const nextButtonStyle = useMemo(() => ({ transform: 'rotate(180deg)' }), [])

  return (
    <div className={ style.RealTimeRanking }>
      <header className={ style.RealTimeRankingHeader }>
        <button>
          <img src="/images/prev.svg" />
        </button>
        <h1>
          <span>
            실시간 키워드 {page}
          </span>
          /2
        </h1>
        <button>
          <img src="/images/prev.svg" style={ nextButtonStyle } />
        </button>
      </header>
      <ul className={ style.RealTimeRankingList }>
        { rankingList.map((v, i) => (
          <li 
            className={ style.RealTimeRankingItem }
            key={ i }
          >
            <div className={ classnames(style.ItemRanking, i + 1 <= 3 ? style.TopRanking : "") }>
              { i + 1 }
            </div>
            <div className={ style.RankingContent }>
              { v }
            </div>
            {/* <div className={ style.TrendingChange }>
            </div> */}
          </li>
        )) }
      </ul>
    </div>
  )
}

export default RealTimeRanking