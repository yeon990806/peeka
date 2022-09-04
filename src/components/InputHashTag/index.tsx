import { useCallback, useEffect, useState } from "react"
import Input from "../Input"

import style from './style.module.scss'

interface InputHashTagProps {
  setList: (v: string[]) => void
}

const InputHashTag = (props: InputHashTagProps) => {
  const [hashList, setHashList] = useState<string[]>([])
  const [inputHash, setInputHash] = useState<string>('')

  const addHashTag = useCallback(() => {
    if (hashList.length < 25) {
      const addingHash = '#' + inputHash.replace(/(\s*)/g, '')

      if (hashList.findIndex(v => v === addingHash) < 0) {
        setHashList([...hashList, addingHash])
      }
      setInputHash('')
    }
  }, [inputHash])

  const onClickRemoveHash = (value: string) => {
    let list = hashList.filter((v) => v !== value)

    setHashList(list)
    setInputHash('')
  }

  useEffect(() => props.setList(hashList), [hashList])

  return (
    <div className={ style.InputHashTag }>
      <Input
        type="text"
        placeholder="해시태그 입력, 최대 25개까지 등록 가능"
        value={ inputHash }
        onInput={ setInputHash }
        onSpace={ addHashTag }
        small
        borderless
        additionalClass={ style.InputHash }
      />
      <div className={ style.HashContainer }>
        { hashList.map((v, i) => (
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