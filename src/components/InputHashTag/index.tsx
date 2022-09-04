import { useCallback, useEffect, useState } from "react"
import Input from "../Input"

import style from './style.module.scss'

interface InputHashTagProps {
  hashList: string[]
  setList: (v: string[]) => void
}

const InputHashTag = (props: InputHashTagProps) => {
  const [inputHash, setInputHash] = useState<string>('')

  const addHashTag = useCallback(() => {
    if (props.hashList.length < 25) {
      const addingHash = '#' + inputHash.replace(/(\s*)/g, '')

      if (props.hashList.findIndex(v => v === addingHash) < 0) {
        props.setList([...props.hashList, addingHash])
      }
      setInputHash('')
    }
  }, [inputHash])

  const onClickRemoveHash = (value: string) => {
    let list = props.hashList.filter((v) => v !== value)

    props.setList(list)
    setInputHash('')
  }

  useEffect(() => props.setList(props.hashList), [props.hashList])

  return (
    <div className={ style.InputHashTag }>
      <Input
        type="text"
        placeholder="해시태그 입력, 최대 25개까지 등록이 가능해요"
        value={ inputHash }
        onInput={ setInputHash }
        onSpace={ addHashTag }
        small
        borderless
        additionalClass={ style.InputHash }
      />
      <div className={ style.HashContainer }>
        { props.hashList.map((v, i) => (
          <div
            className={ style.HashTag }
            key={ i }
            onClick={ () => onClickRemoveHash(v) }
          >
            { v }
          </div>
        )) }
      </div>
    </div>
  )
}

export default InputHashTag