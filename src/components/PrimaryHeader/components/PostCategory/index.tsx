import { CategoryType } from "@/common/defines/Category"
import { StateType } from "@/common/defines/Store"
import { IsMobile } from "@/common/hooks/breakpoints"
import Button from "@/components/Button"
import { CHANGE_POST_CATEGORY, FETCH_POST_REQUEST } from "@/store/reducer/post"
import classNames from "classnames"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import style from './style.module.scss'

const PostCategory = () => {
  const mobile = IsMobile()
  const router = useRouter()
  const dispatch = useDispatch()
  const category = useSelector((state: StateType) => state.post.postCategory)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(category || CategoryType.전체)

  const onClickCategoryButton = useCallback((v) => {
    setSelectedCategory(v)

    dispatch({
      type: CHANGE_POST_CATEGORY,
      data: v
    })

    if (v !== selectedCategory)
      dispatch({
        type: FETCH_POST_REQUEST,
        data: {
          id: '',
          paging_number: 0,
          paging_size: 20,
          category_code: v,
          initPost: true,
        }
      })

    if (router.pathname.indexOf('community') < 0) router.push('/community')
  }, [selectedCategory, category])

  useEffect(() => {
    if (selectedCategory && router.pathname.indexOf('community') < 0) setSelectedCategory(null)
    else onClickCategoryButton(category)
  }, [router.pathname])

  return (
    <nav className={ classNames(style.PostCategory, !mobile ? style.DeskCategory : '') }>
      { (Object.keys(CategoryType) as Array<keyof typeof CategoryType>).map((key) => (
        <Button
          key={ key }
          theme={ CategoryType[key] === selectedCategory ? "primary" : "gray" }
          type="text"
          onClick={ () => onClickCategoryButton(CategoryType[key]) }
        >
          { key }
        </Button>
      )) }
      {/* { !isMobile && <button className={ style.FilterButton }>
        <img src="/images/filter.svg" alt="filter" />
      </button> } */}
    </nav>
  )
}

export default PostCategory