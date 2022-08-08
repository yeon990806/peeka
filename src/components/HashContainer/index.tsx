import { CategoryType } from "@/common/defines/Category";
import { StateType } from "@/common/defines/Store";
import { FETCH_CURATOR_REQUEST } from "@/store/reducer/content";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";

import style from "./style.module.scss"

const HashContainer = () => {
  const dispatch = useDispatch()
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
          <Button
            key={ i }
            type="hashtag"
            theme="gray"
          >
            #{ v.nickname }
          </Button>
        )) }
      </div>
    </div>
  )
}

export default HashContainer