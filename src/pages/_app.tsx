import wrapper from '@/store/index'
import axios from 'axios'
import AppLayout from '@/layout/AppLayout'
import AlertProvider from '@/components/AlertProvider'
import ImagePopup from '@/components/ImagePopup'
import SignLayout from '@/layout/SignLayout'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { getCookie } from '@/common/libs/Cookie'
import { FETCH_USERINFO_REQUEST, RE_ISSUE_REQUEST, UPDATE_USERINFO } from '@/store/reducer/user'

import "@nextcss/reset"
import "styles/common.scss"
import { openPopup, UPDATE_POPUP } from '@/store/reducer/popup'
import { PopupCode } from '@/common/defines/Popup'

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/' : 'https://www.peeka.ai';
axios.defaults.headers['Authorization'] = `Bearer ${ getCookie('accessToken') || "" }`
axios.interceptors.request.use(
  (config) => {
    config.timeout = 2000

    return config
  }
)

export enum LayoutType {
  App = 0,
  Sign = 1,
  MyPage = 2,
}

const App = ({ Component, pageProps }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const userInfo = getCookie('userInfo')
    const resizeEvent = () => {
      document.documentElement.style.setProperty('--vh', `${ window.innerHeight * 0.01 }px`)
    }

    resizeEvent()

    window.addEventListener('resize', resizeEvent)
    
    if (userInfo) {
      dispatch({
        type: UPDATE_USERINFO,
        data: userInfo
      })
      dispatch({
        type: FETCH_USERINFO_REQUEST
      })
    }

    axios.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      const code = error.code;
      const status = error.response?.status
    
      if (code === 'ECONNABORTED')
        dispatch(openPopup(PopupCode.UNKNOWN))
      if (status === 401)
        dispatch({
          type: RE_ISSUE_REQUEST
        })
    })

    return window.removeEventListener('resize', resizeEvent)
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