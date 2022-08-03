import { CategoryType } from "@/common/defines/Category";
import Button from "@/components/Button";
import classnames from "classnames"
import router, { useRouter } from "next/router"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react";

import style from "../../style.module.scss"
import MobileHeader from "./components/MobileHeader";
import ProfileContainer from "./components/ProfileContainer";
import { useDispatch, useSelector } from 'react-redux';
import { CHANGE_POST_CATEGORY } from "@/store/reducer/post";
import { StateType } from "@/common/defines/Store";
import { IsMobile } from "@/common/hooks/breakpoints";

interface PrimaryHeaderType {
  hideCategory?: boolean
}

const PrimaryHeader = (props: PrimaryHeaderType) => {
  const mobile = IsMobile()
  const router = useRouter()
  const dispatch = useDispatch()
  const postCategory = useSelector((state: StateType) => state.post.postCategory)

  const [showing, setShowing] = useState<boolean>(false);
  const [displaySearch, setDisplaySearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>('MV')

  const onChangeSearchText = useCallback((v) => setSearchText(v), [searchText])
  const onChangeSearchCategory = useCallback((v) => setSearchCategory(v), [[searchCategory]])
  const onClickCategoryButton = useCallback((param: CategoryType) => {
    dispatch({
      type: CHANGE_POST_CATEGORY,
      data: param,
    })

    if (router.route.indexOf('/community') < 0) router.push('/community')
  }, [postCategory])
  const submitSearch = useCallback(() => {
    router.push(`/search/${searchCategory}/${searchText}`)
  }, [searchText, searchCategory])

  useEffect(() => {
    setShowing(true);
  }, []);

  const HeaderCategory = ({ mobile }) => {
    if (props.hideCategory) return null
    
    return (
      <nav className={ classnames(style.category, !mobile ? style.DeskCategory : '') }>
        { (Object.keys(CategoryType) as Array<keyof typeof CategoryType>).map((key) => (
          <Button
            key={ key }
            theme={ CategoryType[key] === postCategory ? "primary" : "gray" }
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

  if (!showing) {
    return null;
  }

  return (
    <> { mobile
      ? <>
        <MobileHeader
          displaySearch={ displaySearch }
          onToggleSearch={ () => setDisplaySearch(!displaySearch) }
          searchText={ searchText }
          searchCategory={ searchCategory }
          changeSearchText={ (v) => onChangeSearchText(v) }
          changeSearchCategory={ (v) => onChangeSearchCategory(v) }
          submitSearch={ () => submitSearch() }
        />
        <HeaderCategory mobile />
      </>
      : <div className={ style.DeskHeader }>
        <div className={ style.Container }>
          <Link href="/community">
            <a className={ style.logo }>
              Peeka
            </a>
          </Link>
          <div className={ style.DeskCategory }>
            <HeaderCategory mobile={ false } />
          </div>
        </div>
        <ProfileContainer
          toggleSearch={ displaySearch }
          searchText={ searchText }
          onToggleSearch={ () => setDisplaySearch(true) }
        />
      </div>
    } </>
  )
}

export default PrimaryHeader