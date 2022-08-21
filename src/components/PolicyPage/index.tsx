import { IsMobile } from '@/common/hooks/breakpoints'
import { ReactNode } from 'react'
import classNames from 'classnames'

import style from './style.module.scss'

interface PolicyPageProps {
  title: string
  content: ReactNode
}

const PolicyPage = (props: PolicyPageProps) => {
  const mobile = IsMobile()

  return (
    <div className={ classNames(style.PolicyPage, mobile && style.Mobile) }>
      <header>
        { props.title }
      </header>
      <section>
        { props.content }
      </section>
    </div>
  )
}

export default PolicyPage