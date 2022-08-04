import { useRouter } from "next/router"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react";
import ProfileContainer from "./components/ProfileContainer";
import { IsMobile } from "@/common/hooks/breakpoints";
import InputSearch from "./components/InputSearch";
import PostCategory from "./components/PostCategory";

import style from './style.module.scss'

const PrimaryHeader = () => {
  const mobile = IsMobile()
  const router = useRouter()

  const [showing, setShowing] = useState<boolean>(false);
  const [displaySearch, setDisplaySearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>('MV')

  const onChangeSearchText = useCallback((v) => setSearchText(v), [searchText])
  const onChangeSearchCategory = useCallback((v) => setSearchCategory(v), [[searchCategory]])
  const submitSearch = useCallback(() => {
    router.push(`/search/${searchCategory}/${searchText}`)
  }, [searchText, searchCategory])

  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing) {
    return null;
  }

  return (
    <div className={ style.PrimaryHeader }>
      { mobile
      ? <div className={ style.MobileHeader }>
        <div className={ style.tp }>
          <Link href="/community">
            <a className={ style.logo }>
              Peeka
            </a>
          </Link>
          <InputSearch
            displaySearch={ displaySearch }
            searchCategory={ searchCategory }
            searchText={ searchText }
            onChangeCategory={ (v) => onChangeSearchCategory(v) }
            onChangeText={ (v) => onChangeSearchText(v) }
            onToggleSearch={ (v) => setDisplaySearch(v) }
            onSearch={ () => submitSearch() }
          />
          <ProfileContainer
            onToggleSearch={ () => setDisplaySearch(true) }
          />
        </div>
        <PostCategory />
      </div>
      : <>
        <div className={ style.ScreenHeader }>
          <div className={ style.Container }>
            <Link href="/community">
              <a className={ style.logo }>
                Peeka
              </a>
            </Link>
            <div className={ style.DeskCategory }>
            <PostCategory />
            </div>
          </div>
          <ProfileContainer
            displaySearch={ displaySearch }
            onToggleSearch={ () => setDisplaySearch(true) }
            search={
              <InputSearch
                displaySearch={ displaySearch }
                searchCategory={ searchCategory }
                searchText={ searchText }
                onChangeCategory={ (v) => onChangeSearchCategory(v) }
                onChangeText={ (v) => onChangeSearchText(v) }
                onToggleSearch={ () => setDisplaySearch(true) }
                onSearch={ () => submitSearch() }
              />
            }
          />
        </div>
      </> }
    </div>
  )
}

export default PrimaryHeader