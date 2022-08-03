import GlobalHeader, { HeaderType } from "@/components/GlobalHeader"

import style from "./style.module.scss"
import { useState, useEffect, useMemo } from 'react';
import TopButton from "@/components/TopButton";

interface AppLayoutProps {
  children: React.ReactNode,
}

const AppLayout = (props: AppLayoutProps) => {
  const [isShowing, setIsShowing] = useState<boolean>(false)
  const [displayTopButton, setDisplayTopButton] = useState<boolean>(false)

  const TopButtonStyle = useMemo(() => ({
    top: 80,
    left: 0,
    right: 0,
    margin: '0 auto',
  }), [])
  
  useEffect(() => {
    setIsShowing(true)
  }, [])

  if (!isShowing) return <></>

  return (
    <div className={ style.AppLayout }>
      <GlobalHeader />
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
      </div>
    </div>
  )
}

export default AppLayout