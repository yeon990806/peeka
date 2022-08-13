
import style from "./style.module.scss"
import { useState, useEffect, useMemo } from 'react';
import TopButton from "@/components/TopButton";
import PrimaryHeader from "@/components/PrimaryHeader";
import { useMediaQuery } from "react-responsive";
import RealTimeRanking from "@/components/RealTimeRanking";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_CURATOR_REQUEST } from "@/store/reducer/content";
import VideoList from "@/components/VideoList";
import { FETCH_ALERT_REQUEST } from "@/store/reducer/user";
import { StateType } from "@/common/defines/Store";
import user from "src/pages/login";

interface AppLayoutProps {
  children: React.ReactNode,
}

const AppLayout = (props: AppLayoutProps) => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const [isShowing, setIsShowing] = useState<boolean>(false)
  const [displayTopButton, setDisplayTopButton] = useState<boolean>(false)
  const wideScreen = useMediaQuery({
    query: '(min-width: 1400px)',
  })

  const TopButtonStyle = useMemo(() => ({
    top: 80,
    left: 0,
    right: 0,
    margin: '0 auto',
  }), [])
  const fetchAlertList = () => dispatch({
    type: FETCH_ALERT_REQUEST,
    data: {
      id: (userInfo && (userInfo.alertList && userInfo.alertList.length > 0)) ? userInfo.alertList[0].id : ''
    }
  })
  
  useEffect(() => {
    setIsShowing(true)
    fetchAlertList()
  }, [])

  if (!isShowing) return <></>

  return (
    <div className={ style.AppLayout }>
      <PrimaryHeader />
      <div className="container">
        <div className="content-container">
          {
            document.body.clientHeight > document.body.scrollHeight &&
            <TopButton
              style={ TopButtonStyle }
              onClick={ () => {} }
            />
          }
          { props.children }
        </div>
        { wideScreen && <RealTimeRanking /> }
        { wideScreen && <VideoList /> }
      </div>
    </div>
  )
}

export default AppLayout