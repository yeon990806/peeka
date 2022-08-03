import React from "react"
import classNames from "classnames";
import { DefaultProps } from '@/common/defines/Props';

import style from "./style.module.scss"

interface CheckboxProps extends DefaultProps {
  label?: React.ReactNode | string;
  value?: boolean;
  readonly?: boolean;
  id: string;
  postfix?: React.ReactNode;
  block?: boolean;

  onClick: (val?: boolean) => void;
}

const Checkbox = (props: CheckboxProps) => {
  const uid = `Checkbox-${props.id}`

  return (
    <div className={ classNames(style.Checkbox, props.block && style.block) }>
      <label htmlFor={ uid } style={ props.style }>
        <img src={`/images/check-${ props.value ? 'on' : 'off' }.svg`} tabIndex={-1} alt="check" />
        { props.label }
        <input
          type="checkbox"
          id={ uid }
          name={ uid }
          checked={ props.value }
          readOnly
          onClick={ (e) => {
            e.preventDefault()
            if (props.onClick && !props.readonly) props.onClick(!props.value)
          } }
        />
      </label>
      { props.postfix }
    </div>
  );
}

export default Checkbox