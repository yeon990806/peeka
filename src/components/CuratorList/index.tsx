import { useEffect } from "react"
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_CURATOR_REQUEST } from "@/store/reducer/content";
import { StateType } from "@/common/defines/Store";
import { CodeCategoryType } from "@/common/defines/Category";
import { getTimeFromNow } from "@/common/defines/Format";
import UserProfile from "../UserProfile";

import style from "./style.module.scss"
import Footer from "../Footer";

const CuratorList = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const curatorList = useSelector((state: StateType) => state.content.curatorList)

  useEffect(() => {
    dispatch({
      type: FETCH_CURATOR_REQUEST,
      data: {
        category: '',
        id: ''
      }
    })
  }, [])

  return (
    <div className={ style.CuratorListContainer }>
      <div className={ style.CuratorList }>
        <header className={ style.CuratorHeader }>
          <h1>
            <img src="/images/peeka-paint.svg" alt="peeka" tabIndex={-1} role="presentation" />
            <span>
              큐레이터 포스트
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
      <Footer />
    </div>
  )
}

export default CuratorList