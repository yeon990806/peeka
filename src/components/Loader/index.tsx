import classNames from 'classnames'

import style from './style.module.scss'

interface LoaderProps {
  small?: boolean
  inline?: boolean
}

const Loader = (props: LoaderProps) => {
  return (
    <div className={ classNames(style.LoaderContainer, props.inline && style.InlineLoader) }>
      <div className={ classNames(style.Loader) }>
        <div className={ classNames( style.LoaderPart, style.LoaderTop, props.small && style.SmallLoader) }>
          <div className={ style.LoaderRotater } />
        </div>
        <div className={ classNames( style.LoaderPart, style.LoaderBottom, props.small && style.SmallLoader ) }>
          <div className={ style.LoaderRotater } />
        </div>
      </div>
    </div>
  )
}

export default Loader