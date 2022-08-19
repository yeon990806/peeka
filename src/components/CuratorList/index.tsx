import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_CURATOR_REQUEST } from "@/store/reducer/content";
import { StateType } from "@/common/defines/Store";
import { CategoryType, CodeCategoryType } from "@/common/defines/Category";
import { getTimeFromNow } from "@/common/defines/Format";
import UserProfile from "../UserProfile";

import style from "./style.module.scss"

const CuratorList = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const curatorList = useSelector((state: StateType) => state.content.curatorList)
  const category = useSelector((state: StateType) => state.post.postCategory)
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    dispatch({
      type: FETCH_CURATOR_REQUEST,
      data: {
        category: category === CategoryType.전체 ? '' : category,
        id: curatorList.length > 0 ? curatorList[0].id : ''
      }
    })

    switch (category) {
      case CategoryType.영화:
        return setTitle ('영화')
      case CategoryType.시리즈:
        return setTitle ('시리즈')
      case CategoryType.웹툰:
        return setTitle ('웹툰')
      case CategoryType.웹소설:
        return setTitle ('웹소설')
      case CategoryType.전체:
      default:
        return setTitle('피카')
    }
  }, [category])

  return (
    <div className={ style.CuratorListContainer }>
      <div className={ style.CuratorList }>
        <header className={ style.CuratorHeader }>
          <h1>
            <span>
              { title } 큐레이터
            </span>
          </h1>
        </header>
        <ul className={ style.CuratorListContent }>
          { curatorList.map(curator => (
            <li 
              className={ style.Curator }
              key={ curator.id }
              onClick={ () => router.push(`/userpost/${ curator.member_id }`) }
            >
              <UserProfile
                userMembership
                size="sm"
                profileImage={ curator.member_image }
              />
              <div className={ style.CuratorInfo }>
                <div className={ style.CuratorName }>
                  { curator.nickname.replace('@', '') }님의 { CodeCategoryType[ curator.category_code ] } 포스트
                </div>
                <div className={ style.CuratorUpdated }>
                  { getTimeFromNow(curator.created_at.toString()) }
                </div>
              </div>
            </li>
          )) }
        </ul>
      </div>
    </div>
  )
}

export default CuratorList