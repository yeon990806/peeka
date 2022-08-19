import { CategoryType, CodeCategoryType } from "@/common/defines/Category";
import { getTimeFromNow } from "@/common/defines/Format";
import { StateType } from "@/common/defines/Store";
import { FETCH_CURATOR_REQUEST } from "@/store/reducer/content";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "../UserProfile";

import style from "./style.module.scss"

const HashContainer = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const curatorList = useSelector((state: StateType) => state.content.curatorList)
  const category = useSelector((state: StateType) => state.post.postCategory)

  useEffect(() => {
    if (category)
      dispatch({
        type: FETCH_CURATOR_REQUEST,
        data: {
          category: category === CategoryType.전체 ? '' : category,
          id: curatorList.length > 0 ? curatorList[0].id : ''
        }
      })
  }, [category])

  return (
    <div className={ style.HashContainer }>
      <div className={ style.Hash }>
        { curatorList.map((v, i) => (
          <div
            key={ v.id }
            className={ style.HashContent }
            onClick={ () => router.push(`/userpost/${ v.member_id }`) }
          >
            <UserProfile
              size="xs"
              profileImage={ v.member_image }
              userMembership
            />
            <div className={ style.HashTitle }>
              { v.nickname.replaceAll('@', '') }
            </div>
            <div className={ style.HashText }>
              { CodeCategoryType[v.category_code] || "웹툰" }
              <span> | </span>
              { getTimeFromNow(v.created_at.toString()) }
            </div>
          </div>
        )) }
      </div>
    </div>
  )
}

export default HashContainer