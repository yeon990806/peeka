import style from "./style.module.scss"
import { useEffect, useState } from 'react'
import PrimaryHeader from './containers/PrimaryHeader';

export enum HeaderType {
  Null = -1,
  Primary = 0,
  Search = 1,
  Back = 2,
  Profile = 3
}

interface GlobalHeaderProps {
  headerType?: HeaderType;
}

const GlobalHeader = (props: GlobalHeaderProps) => {
  const [type, setType] = useState<HeaderType>(HeaderType.Primary)

  useEffect(() => {
    if (props.headerType) setType(props.headerType)
  }, [props.headerType])


  const SearchHeader = () => {
    return (
      <div className={ style.SearchHeader }>
        <button className={ style.SearchCategory }>
          <span>M</span>
        </button>
        <input
          className={ style.SearchInput }
          type="text"
          placeholder="검색어를 입력하세요."
        />
        <button
          className={ style.SearchCancel }
          onClick={ () => setType(HeaderType.Primary) }
        >
          취소
        </button>
      </div>
    )
  }

  return (
    <header className={ style.header } id="header">
      <PrimaryHeader />
    </header>
  )
}

export default GlobalHeader