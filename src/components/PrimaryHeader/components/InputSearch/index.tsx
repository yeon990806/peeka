import { CodeCategoryType } from '@/common/defines/Category'
import { IsMobile } from '@/common/hooks/breakpoints'
import Button from '@/components/Button'
import Input from '@/components/Input'
import MenuPopup, { PopupItemProps } from '@/components/MenuPopup'
import { useCallback, useMemo, useRef, useState } from 'react'
import style from './style.module.scss'

interface InputSearchProps {
  displaySearch: boolean
  searchText: string
  searchCategory: string
  onChangeText: (v: string) => void
  onChangeCategory: (v: string) => void
  onToggleSearch: (v: boolean) => void
  onSearch: () => void
}

const InputSearch = (props: InputSearchProps) => {
  const mobile = IsMobile()
  const [toggleSelectCategory, setToggleSelectCategory] = useState<boolean>(false)
  const [categorySelect, setCategorySelect] = useState<boolean>(false)
  
  const InputStyle = useMemo(() => ({ paddingLeft: 32, height: 28 }), [])
  const onToggleCategoryPopup = useCallback(() => setToggleSelectCategory(prev => !prev), [toggleSelectCategory])
  const onToggleCategorySelect = useCallback(() => setCategorySelect(prev => !prev), [categorySelect])

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
              props.onChangeCategory(v)
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

  if (!props.displaySearch) return null
  
  if (mobile) return (
    <div className={ style.MobileSearch }>
      { toggleSelectCategory && <SetCategoryPopup /> }
      <CategoryButton />
      <Input
        additionalClass={ style.SearchInput }
        placeholder="검색어를 입력하세요."
        searchInput
        value={ props.searchText }
        style={ InputStyle }
        onInput={ (v) => props.onChangeText(v) }
        onEnter={ () => props.onSearch() }
      />
      <Button
        type="text"
        theme="light"
        onClick={ () => props.onToggleSearch(false) }
      >
        취소
      </Button>
    </div>
  )
  else return (
    <div className={ style.ScreenSearch }>
      <Input
        searchInput
        placeholder="검색어를 입력하세요."
        value={ props.searchText }
        prefix={
          <div className={ style.SearchCategory }>
            <Button
              onClick={ () => onToggleCategorySelect() }
              type="search"
            >
              { props.searchCategory }
            </Button>
            { categorySelect && <ul className={ style.SearchCategoryList }>
              { Object.keys(CodeCategoryType).map((v) => (
                <li className={ style.SelectCategoryButton }
                  key={ v }
                  onClick={ (e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    onToggleCategorySelect()
                    props.onChangeCategory(v)
                  } }
                >
                  <div>{ `${v} ${CodeCategoryType[v]}` }</div>
                </li>
              )) }
            </ul> }
          </div>
        }
        onInput={ (v) => props.onChangeText(v) }
        onEnter={ () => props.onSearch() }
        postfix={ <Button type="icon" onClick={ () => props.onSearch() }>
          <img src="/images/search.svg" alt="search" />
        </Button> }
      />
    </div>
  )
}

export default InputSearch