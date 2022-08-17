
import style from "./style.module.scss"
import { useState, useEffect, useCallback, createRef } from 'react';
import TopButton from "@/components/TopButton";
import PrimaryHeader from "@/components/PrimaryHeader";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import VideoList from "@/components/VideoList";
import { FETCH_ALERT_REQUEST } from "@/store/reducer/user";
import { StateType } from "@/common/defines/Store";
import CuratorList from "@/components/CuratorList";
import SignInPopup from "@/components/SignInPopup";
import { TOGGLE_SIGN_IN_POPUP } from "@/store/reducer/popup";

interface AppLayoutProps {
  children: React.ReactNode,
}

const AppLayout = (props: AppLayoutProps) => {
  const dispatch = useDispatch()
  const container = createRef<HTMLDivElement>()
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const signInPopupDisplay = useSelector((state: StateType) => state.popup.signInPopupDisplay)
  const [isShowing, setIsShowing] = useState<boolean>(false)
  const [scrollY, setScrollY] = useState<number>(0)
  const wideScreen = useMediaQuery({
    query: '(min-width: 1400px)',
  })

  const fetchAlertList = () => dispatch({
    type: FETCH_ALERT_REQUEST,
    data: {
      id: (userInfo && (userInfo.alertList && userInfo.alertList.length > 0)) ? userInfo.alertList[userInfo.alertList.length - 1].id : ''
    }
  })

  const toggleSignInPopup = () => dispatch({
    type: TOGGLE_SIGN_IN_POPUP,
  })

  const onFollow = () => {
    setScrollY(container.current.scrollTop)
  }

  const onClickHandleTop = useCallback(() => {
    container.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    setScrollY(0)
  }, [scrollY])
  
  useEffect(() => {
    // let watch = null

    setIsShowing(true)
    if (userInfo.id) fetchAlertList()
    // if (container.current) {
    //   const watch = () => {
    //     container.current.addEventListener('scroll', onFollow)
    //   }

    //   watch()
    // }


    // return () => {
    //   if (container.current) container.current.removeEventListener('scroll', onFollow)
    // }
  }, [])
  if (!isShowing) return <></>
  return (
    <div className={ style.AppLayout }>
      <PrimaryHeader />
      { scrollY >= 1200 && <TopButton
        onClick={ () => onClickHandleTop() }
      /> }
      <div className={ style.Container } ref={ container }>
        <div className={ style.ContentContainer }>
          { props.children }
        </div>
      </div>
      { wideScreen && <VideoList /> }
      { wideScreen && <CuratorList /> }
      <SignInPopup
        display={ signInPopupDisplay }
        onClose={ toggleSignInPopup }
      />
    </div>
  )
}

export default AppLayout