import PropTypes from 'prop-types'

import wrapper from '@/store/index'

import "@nextcss/reset"
import "styles/common.scss"
import AppLayout from '@/layout/AppLayout'
import SignLayout from '@/layout/SignLayout'
import axios from 'axios'
import { useEffect, useState } from 'react';
import ImagePopup from '@/components/ImagePopup'
import { useDispatch } from 'react-redux'
import router from 'next/router'
import { getCookie } from '@/common/libs/Cookie'
import { FETCH_USERINFO_REQUEST, UPDATE_USERINFO } from '@/store/reducer/user'
import AlertProvider from '@/components/AlertProvider'

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/' : 'https://www.peeka.ai';

export enum LayoutType {
  App = 0,
  Sign = 1,
  MyPage = 2,
}

const App = ({ Component, pageProps }) => {
  const dispatch = useDispatch()
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const userInfo = getCookie('userInfo')
      
      if (userInfo)
        dispatch({
          type: UPDATE_USERINFO,
          data: userInfo
        })
      dispatch({
        type: FETCH_USERINFO_REQUEST
      })
    }
  }, [mounted])

  const applyLayout = () => {
    const layout = Component.getLayout;

    switch (layout) {
      case LayoutType.Sign:
        return (
          <SignLayout>
            <Component {...pageProps} />
          </SignLayout>
        )
      case LayoutType.App:
      default:
        return (
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        )
    }
  }

  return (
    <div id="wrapper" className={Component.getLayout === LayoutType.Sign ? "sign" : "" }>
      { applyLayout() }
      <ImagePopup />
      <AlertProvider />
    </div>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
}

export default wrapper.withRedux(App)