import { useCallback, useEffect, useState } from "react"
import Input from "../Input"

import style from './style.module.scss'

interface InputHashTagProps {
  hashList: string[]
  inputHash: string
  setInput: (v: string) => void
  setList: (v: string[]) => void
}

const InputHashTag = (props: InputHashTagProps) => {

  const addHashTag = useCallback(() => {
    if (props.hashList.length < 25) {
      let txt = props.inputHash.replace(/(\s*)/g, '').replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '')

      if (txt.length < 1) return props.setInput('')
      else txt = '#' + txt

      if (props.hashList.findIndex(v => v === txt) < 0) {
        props.setList([...props.hashList, txt])
      }
      props.setInput('')
    }
  }, [props.inputHash])

  const onClickRemoveHash = (value: string) => {
    let list = props.hashList.filter((v) => v !== value)

    props.setList(list)
    props.setInput('')
  }

  useEffect(() => props.setList(props.hashList), [props.hashList])

  return (
    <div className={ style.InputHashTag }>
      <Input
        type="text"
        placeholder="해시태그 입력, 최대 25개까지 등록이 가능해요"
        value={ props.inputHash }
        onInput={ props.setInput }
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