import Link from 'next/link'
import { useRouter } from 'next/router'

import style from './style.module.scss'

const Footer = () => {
  const router = useRouter()

  return (
    <div className={ style.Footer }>
      <div className={ style.Policy }>
        <Link href="/policy">
          <a>
            서비스 이용약관
          </a>
        </Link>
        <span>|</span>
        <Link href="/privacy">
          <a>
            개인정보 처리방침
          </a>
        </Link>
      </div>
      <a href="mailto:help@peeka.ai" target="_blank">
        고객센터 문의: help@peeka.ai
      </a>
      <a href="mailto:marketing@peeka.ai" target="_blank">
        마케팅/제휴 문의: marketing@peeka.ai
      </a>
      <p>
        Copyright © Peeka corp. All rights reserved.
      </p>
    </div>
  )
}

export default Footer