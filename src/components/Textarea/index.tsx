import { memo, useEffect, useState } from 'react'
import { createRef } from 'react';
import { DefaultProps } from '@/common/defines/Props';
import classNames from "classnames"

import style from "./style.module.scss"

interface TextareaProps extends DefaultProps {
  value: string;

  id?: string;
  name?: string;
  readonly?: boolean;
  disabled?: boolean;
  row?: number;
  fixedHeight?: boolean;
  placeholder?: string;
  description?: string;
  draggable?: boolean;
  pattern?: string;
  renderFocus?: boolean;
  resizable?: boolean;
  block?: boolean;
  borderless?: boolean;
  paddingless?: boolean;
  maxLength?: number;

  onInput?: (value: TextareaProps['value']) => void;
  onChange?: (value: TextareaProps['value']) => void;
  onEnter?: (e) => void;
}

const Textarea = memo((props: TextareaProps) => {
  const TextareaRef = createRef<HTMLTextAreaElement>()

  const [focus, setFocus] = useState<boolean>(false)
  const [input, setInput] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>(props.value)
  
  const disabledState = props.readonly || props.disabled

  const resizeTextarea = () => {
    TextareaRef.current.style.height = '0px'
    TextareaRef.current.style.height = (12 + TextareaRef.current.scrollHeight >= 500 ? 500 : TextareaRef.current.scrollHeight) + 'px'
  }

  useEffect(() => setInputValue(props.value), [props.value])

  useEffect(() => {
    if (input && props.onInput) props.onInput(inputValue)
    if (!focus && props.onChange) props.onChange(inputValue)
  }, [focus, input, inputValue])

  useEffect(() => {
    if (props.renderFocus) TextareaRef.current.focus()
  }, [])

  return (
    <div className={ classNames(style.Textarea, props.block && style.Block, props.borderless && style.Borderless, props.paddingless && style.Paddingless) }>
      <div className={ style.TextareaContainer }>
        <textarea
          className={ classNames(props.resizable && style.resizable) }
          value={ inputValue }
          ref={ TextareaRef }
          id={ props.id && `Textarea-${props.id}` }
          name={ props.name }
          readOnly={ props.readonly }
          disabled={ props.disabled }
          placeholder={ props.placeholder }
          draggable={ props.draggable }
          maxLength={ props.maxLength }
          style={ props.style }
          rows={ props.row || 5 }
          onFocus={ (e) => setFocus(true) }
          onBlur={ (e) => {
            setFocus(false)

            if (props.onChange) props.onChange(inputValue)
          } }
          onInput={ (e) => {
            e.preventDefault()

            let value = (e.target as HTMLTextAreaElement).value

            setInput(true)
            setInputValue(value)
          } }
          onKeyUp={ (e) => {
            e.stopPropagation()
            if (!props.fixedHeight) resizeTextarea()
          } }
          onKeyDown={ (e) => {
            if (e.key === 'Enter' && props.onEnter)
              props.onEnter(inputValue)
          } }
        />
      </div>
      { props.description && <p className={ style.TextareaDescription }>
        { props.description }
      </p> }
    </div>
  )
})

export default memo(Textarea)