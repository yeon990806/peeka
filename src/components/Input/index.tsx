import React, { createRef, useEffect, useState, useCallback } from "react";
import classNames from "classnames"

import style from "./style.module.scss"
import { DefaultProps } from "@/common/defines/Props";
import { type } from "os";
import Button from '@/components/Button';

interface InputProps extends DefaultProps {
  value: string;

  id?: string;
  name?: string;
  type?: "text" | "password",
  readonly?: boolean;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  inputmode?: "text" | "decimal" | "numeric" | "tel" | "email" | "url";
  draggable?: boolean;
  description?: string;
  searchInput?: boolean;
  validate?: { (data: string): { state: boolean, msg: string } } [];
  togglePassword?: boolean;
  pattern?: string;

  renderFocus?: boolean

  postfix?: React.ReactNode;
  prefix?: React.ReactNode;

  onInput?: (value: InputProps['value']) => void;
  onChange?: (value: InputProps['value']) => void;
  onEnter?: (value: InputProps['value']) => void;
  onError?: (v: boolean) => void;
}

const Input = React.memo((props: InputProps) => {
  const InputRef = createRef<HTMLInputElement>()

  const [focus, setFocus] = useState<boolean>(false)
  const [input, setInput] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [inputError, setInputError] = useState<boolean>(false)
  const [inputDescription, setInputDescription] = useState<string>('')
  const [descriptionStyle, setDescriptionStyle] = useState<"error" | "success" | "normal">("normal")
  const [togglePassword, setTogglePassword] = useState<boolean>(true)
  const [inputType, setInputType] = useState<"text" | "password">(props.type ? props.type : "text");

  const setDescStyle = useCallback((v) => {
    setDescriptionStyle(v)
  }, [])
  const disabledState = props.readonly || props.disabled

  useEffect(() => {
    if (input && props.onInput) props.onInput(inputValue)
    if (!focus && props.onChange) props.onChange(inputValue)

    if (props.validate && props.validate.length > 0 && inputValue)
      for (let i = 0; i < props.validate.length; i++) {
        const result = props.validate[i](inputValue);
  
        setInputDescription(result.msg)
        
        if (!result.state || inputValue.length === 0) {
          setInputError(true)
          setDescStyle('normal')
          
          break
        } else {
          setInputError(false)
          setDescStyle('success')
        }
      }
    else {
      setInputError(false)
      setDescStyle('normal')
      setInputDescription('')

      return
    }
  }, [focus, input, inputValue])

  useEffect(() => {
    if (props.onError) props.onError(inputError)
  }, [inputError])

  useEffect(() => {
    if (props.togglePassword) {
      if (togglePassword) setInputType("password")
      else setInputType("text")
    }
  }, [togglePassword])

  useEffect(() => {
    if (props.renderFocus) InputRef.current.focus()
  }, [])

  return (
    <div className={ classNames(style.Input, disabledState && style.ReadOnly, !disabledState && focus && style.Focus, inputError && style.InputError) }>
      <div className={ classNames(style.InputLine, props.searchInput && style.SearchInput) }>
        { props.prefix && <div className={ style.InputPrefix }>
          { props.prefix }
        </div> }
        <div className={ style.InputContainer }>
          <input
            id={ props.id && `Input-${props.id}` }
            type={ inputType }
            value={ inputValue }
            inputMode={ props.inputmode || 'text' }
            ref={ InputRef }
            maxLength={ props.maxLength }
            readOnly={ props.readonly }
            disabled={ props.disabled }
            placeholder={ props.placeholder }
            draggable={ props.draggable }
            style={ props.style }
            onFocus={ () => setFocus(true) }
            pattern={ props.pattern }
            onInput={ (e) => {
              e.preventDefault()

              let value = (e.target as HTMLInputElement).value

              if (props.inputmode === 'numeric') value = value.replace(/[^0-9*#]/g, '')
              setInput(true)
              setInputValue(value)
            } }
            onBlur={ (e) => {
              e.preventDefault()

              setFocus(false)
              setInput(false)

              if (props.onInput) props.onInput(inputValue)
            } }
            onKeyDown={ (e) => {
              if (e.key === 'Enter' && props.onEnter)
                props.onEnter(inputValue)
            } }
          />
        </div>
        { (props.postfix || props.type === "password") && <div className={ style.InputPostfix }>
          { props.postfix || <Button type="icon" onClick={ () => setTogglePassword(!togglePassword) }>
            <img src={ `/images/password-${togglePassword ? 'on' : 'off'}.svg` } tabIndex={-1} alt="toggle display password" />
          </Button> }
        </div> }
      </div>
      { (inputDescription || props.description) && <p className={ classNames(style.InputDescription, descriptionStyle && style[descriptionStyle]) }>
        { inputDescription || props.description }
      </p> }
    </div>
  )
})

export default React.memo(Input)