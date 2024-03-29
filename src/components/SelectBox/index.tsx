import style from './style.module.scss'
import { DefaultProps } from '@/common/defines/Props';
import { createRef, ReactNode, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

interface SelectBoxProps extends DefaultProps {
  width: number
  id?: string
	value: any
	items: Array<{
		display: ReactNode
		value: any
	}>
	readonly?: boolean
	placeholder?: ReactNode
	onClick?: (value: any) => void
}

const SelectBox = (props: SelectBoxProps) => {
  const ref = createRef<HTMLDivElement>()
  const [visible, setVisible] = useState<boolean>(false)
  const [focus, setFocus] = useState<boolean>(false)

  const selectedItem = props.items.find((item) => item.value === (props.value ? props.value.value : props.value))

  const onBlurEvent = useCallback(() => {
    setVisible(false)
    setFocus(false)
  }, [visible, focus])

  useEffect(() => {
    const onClickOutside = e => {
      if (visible && (ref.current && !ref.current.contains(e.target)))
        onBlurEvent()
    }

    document.addEventListener('mousedown', onClickOutside)

    return () => {
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [visible])

  return (
    <div
      id={ props.id && `Select-${ props.id }` }
      className={ classNames(
        style.SelectBox,
        props.readonly && style.ReadOnly,
        !props.readonly && focus && style.Focus
      ) }
      style={ { ...props.style, width: props.width } }
      ref={ ref }
      tabIndex={ -1 }
      onClick={ (e) => {
        e.preventDefault()
        e.stopPropagation()

        setVisible(true)
      } }
    >
      <div className={ style.SelectDisplay }>
        <div>{ selectedItem ? selectedItem.display : props.placeholder }</div>
        <div className={ style.SelectMore }>
          <img src="/images/top.svg" tabIndex={-2} role="presentation" style={ { transform: visible ? 'rotate(180deg)' : '' } } />
        </div>
      </div>
      { visible && (
        <div className={ style.SelectWrapper }>
          { props.items.map((item, idx) => (
            <div
              key={ idx }
              className={ classNames(style.SelectItem, (props.value ? props.value.value : props.value) === item.value && style.Selected) }
              onClick={ (e) => {
                e.preventDefault()
                e.stopPropagation()
                
                if (props.onClick) props.onClick(item)
                return onBlurEvent()
              } }
            >
              { item.display }
            </div>
          )) }
        </div>
      ) }
    </div>
  )
}

export default SelectBox