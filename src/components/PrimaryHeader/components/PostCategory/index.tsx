import { CategoryType } from "@/common/defines/Category"
import { IsMobile } from "@/common/hooks/breakpoints"
import Button from "@/components/Button"
import { CHANGE_POST_CATEGORY } from "@/store/reducer/post"
import classNames from "classnames"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import style from './style.module.scss'

const PostCategory = () => {
  const mobile = IsMobile()
  const dispatch = useDispatch()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(CategoryType.전체)

  const onClickCategoryButton = useCallback((v) => {
    setSelectedCategory(v)

    dispatch({
      type: CHANGE_POST_CATEGORY,
      data: v
    })

    if (router.pathname.indexOf('community') > -1) router.push('/community')
  }, [selectedCategory])

  useEffect(() => {
    if (selectedCategory && router.pathname.indexOf('community') < 0) setSelectedCategory(null)
    else onClickCategoryButton(CategoryType.전체)
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