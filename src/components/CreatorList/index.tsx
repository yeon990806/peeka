import { useEffect } from "react"
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_CREATOR_REQUEST } from "@/store/reducer/content";
import { StateType } from "@/common/defines/Store";
import { CodeCategoryType } from "@/common/defines/Category";
import { getTimeFromNow } from "@/common/defines/Format";
import UserProfile from "../UserProfile";

import style from "./style.module.scss"
import Footer from "../Footer";

const CreatorList = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const creatorList = useSelector((state: StateType) => state.content.creatorList)

  useEffect(() => {
    dispatch({
      type: FETCH_CREATOR_REQUEST,
      data: {
        category: '',
        id: ''
      }
    })
  }, [])

  return (
    <div className={ style.CreatorListContainer }>
      <div className={ style.CreatorList }>
        <header className={ style.CreatorHeader }>
          <h1>
            <img src="/images/peeka-paint.svg" alt="peeka" tabIndex={-1} role="presentation" />
            <span>
              크리에이터 포스트
            </span>
          </h1>
        </header>
        <ul className={ style.CreatorListContent }>
          { creatorList.map(creator => (
            <li 
              className={ style.Creator }
              key={ creator.id }
              onClick={ () => router.push(`/userpost/${ creator.member_id }`) }
            >
              <UserProfile
                userMembership
                size="sm"
                profileImage={ creator.member_image }
              />
              <div className={ style.CreatorInfo }>
                <div className={ style.CreatorName }>
                  { creator.nickname.replace('@', '') }님의 { CodeCategoryType[ creator.category_code ] } 포스트
                </div>
                <div className={ style.CreatorUpdated }>
                  { getTimeFromNow(creator.created_at.toString()) }
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

export default CreatorList