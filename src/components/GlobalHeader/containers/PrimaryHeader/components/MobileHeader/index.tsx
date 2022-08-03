import Link from "next/link"
import ProfileContainer from "../ProfileContainer"
import Input from "@/components/Input";
import Button from "@/components/Button";
import { CodeCategoryType } from "@/common/defines/Category";
import { useCallback, useMemo, useState } from "react";
import style from "../../../../style.module.scss"
import router from 'next/router'

interface MobileHeaderProps {
  displaySearch: boolean;
  onToggleSearch: () => void;
  searchText: string;
  searchCategory: string;
  changeSearchText: (v: string) => void;
  changeSearchCategory: (v: string) => void;
  submitSearch: () => void;
}

const MobileHeader = (props: MobileHeaderProps) => {
  const [toggleSelectCategory, setToggleSelectCategory] = useState<boolean>(false)

  const InputStyle = useMemo(() => ({ paddingLeft: 32, height: 32 }), [])
  const onToggleCategoryPopup = useCallback(() => setToggleSelectCategory(prev => !prev), [toggleSelectCategory])

  const CategoryButton = () => {
    return <button
      className={ style.CategoryButton }
      onClick={ (e) => {
        e.preventDefault()

        onToggleCategoryPopup()
      } }
    >
      { props.searchCategory } 
    </button>
  }

  const SetCategoryPopup = () => {
    return (
      <ul className={ style.CategoryPopup }>
        { Object.keys(CodeCategoryType).map((v) => (
          <li
            className={ style.SelectCategoryButton }
            key={ v }
            onClick={ (e) => {
              e.preventDefault()
              e.stopPropagation()

              onToggleCategoryPopup()
              props.changeSearchCategory(v)
            } }
          >
            <div>
              { v }
            </div>
            <div>
              { CodeCategoryType[v] }
            </div>
          </li>
        )) }
      </ul>
    )
  }

  if (props.displaySearch)
    return (
      <div className={ style.MobileSearchContainer }>
        { toggleSelectCategory && <SetCategoryPopup /> }
        <CategoryButton />
        <Input
          additionalClass={ style.SearchInput }
          placeholder="검색어를 입력하세요."
          searchInput
          value={ props.searchText }
          style={ InputStyle }
          onInput={ (v) => props.changeSearchText(v) }
          onEnter={ () => props.submitSearch() }
        />
        <Button
          type="text"
          theme="light"
          onClick={ () => props.onToggleSearch() }
        >
          취소
        </Button>
      </div>
    )
  else
    return (
      <div className={ style.tp }>
        <Link href="/community">
          <a className={ style.logo }>
            Peeka
          </a>
        </Link>
        <ProfileContainer
          onToggleSearch={ () => props.onToggleSearch() }
        />
      </div>
    )
}

export default MobileHeader