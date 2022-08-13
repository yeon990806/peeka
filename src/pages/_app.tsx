import wrapper from '@/store/index'
import axios from 'axios'
import AppLayout from '@/layout/AppLayout'
import AlertProvider from '@/components/AlertProvider'
import ImagePopup from '@/components/ImagePopup'
import SignLayout from '@/layout/SignLayout'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { getCookie } from '@/common/libs/Cookie'
import { FETCH_USERINFO_REQUEST, UPDATE_USERINFO } from '@/store/reducer/user'

import "@nextcss/reset"
import "styles/common.scss"

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/' : 'https://www.peeka.ai';

export enum LayoutType {
  App = 0,
  Sign = 1,
  MyPage = 2,
}

const App = ({ Component, pageProps }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const userInfo = getCookie('userInfo')
    
    if (userInfo) {
      dispatch({
        type: UPDATE_USERINFO,
        data: userInfo
      })
      dispatch({
        type: FETCH_USERINFO_REQUEST
      })
    }
  }, [])

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

export default wrapper.withRedux(App)