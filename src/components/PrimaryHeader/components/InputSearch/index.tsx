import { useMemo } from 'react'
import { IsMobile } from '@/common/hooks/breakpoints'
import Button from '@/components/Button'
import Input from '@/components/Input'
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
  
  const InputStyle = useMemo(() => ({ height: 28 }), [])

  if (!props.displaySearch) return null
  
  if (mobile) return (
    <div className={ style.MobileSearch }>
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