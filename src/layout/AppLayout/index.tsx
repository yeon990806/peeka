import { useState, useEffect, useCallback, createRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { FETCH_ALERT_REQUEST } from "@/store/reducer/user";
import { TOGGLE_SIGN_IN_POPUP } from "@/store/reducer/popup";
import { useMediaQuery } from "react-responsive";
import { StateType } from "@/common/defines/Store";
import TopButton from "@/components/TopButton";
import PrimaryHeader from "@/components/PrimaryHeader";
import VideoList from "@/components/VideoList";
import CreatorList from "@/components/CreatorList";
import SignInPopup from "@/components/SignInPopup";

import style from "./style.module.scss"
import PostCategory from '@/components/PrimaryHeader/components/PostCategory';
import { IsMobile } from '@/common/hooks/breakpoints';
import classNames from 'classnames';

interface AppLayoutProps {
  children: React.ReactNode,
}

const AppLayout = (props: AppLayoutProps) => {
  const dispatch = useDispatch()
  const mobile = IsMobile()
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
    <div className={ classNames(style.AppLayout, mobile && style.Mobile) }>
      <PrimaryHeader />
      { scrollY >= 1200 && <TopButton
        onClick={ () => onClickHandleTop() }
      /> }
      <div className={ style.Container } ref={ container }>
        <div className={ style.ContentContainer }>
          { props.children }
        </div>
      </div>
      { mobile && <div className={ style.BottmNavigation }>
        <PostCategory />
      </div> }
      { wideScreen && <VideoList /> }
      { wideScreen && <CreatorList /> }
      <SignInPopup
        display={ signInPopupDisplay }
        onClose={ toggleSignInPopup }
      />
    </div>
  )
}

export default AppLayout