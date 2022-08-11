import { CategoryType } from "@/common/defines/Category";
import { alertType, NoticeCode, StateType } from "@/common/defines/Store";
import { Desktop, Mobile, IsMobile, IsDesktop } from "@/common/hooks/breakpoints";
import Button from "@/components/Button";
import MenuPopup, { PopupItemProps } from "@/components/MenuPopup";
import { FETCH_ALERT_REQUEST, READ_ALERT_REQUEST, SIGN_OUT_REQUEST } from "@/store/reducer/user";
import Router, { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.scss"
import Screen from "@/components/Screen";
import UserProfile from "@/components/UserProfile";

interface ProfileContainerProps {
  displaySearch?: boolean;
  search?: ReactNode;
  onToggleSearch?: (boolean) => void;
}

const ProfileContainer = (props: ProfileContainerProps) => {
  const desktop = IsDesktop()
  const dispatch = useDispatch()
  const router = useRouter()
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const postCategory = useSelector((state: StateType) => state.post.postCategory)
  const [popupDisplay, setPopupDisplay] = useState<boolean>(false)
  const [screenDisplay, setScreenDisplay] = useState<boolean>(false)

  const signOut = useCallback(() => dispatch({
    type: SIGN_OUT_REQUEST,
  }), [])
  const fetchAlertList = () => dispatch({
    type: FETCH_ALERT_REQUEST,
    data: {
      id: (userInfo && (userInfo.alertList && userInfo.alertList.length > 0)) ? userInfo.alertList[0].id : ''
    }
  })
  const onClickAlertButton = useCallback(() => {
    if (desktop) setPopupDisplay(prev => !prev)
    else setScreenDisplay(prev => !prev)

    fetchAlertList()
  }, [popupDisplay, screenDisplay, desktop])
  
  const onPrevEvent = useCallback(() => setScreenDisplay(prev => !prev), [screenDisplay]) 

  const onReadNotice = (notice: alertType) => {
    if (notice.notice_code === NoticeCode.OP) return

    setPopupDisplay(false)
    setScreenDisplay(false)

    dispatch({
      type: READ_ALERT_REQUEST,
      data: {
        id: notice.id,
        check: notice.check_yn,
        source: notice.contents_source,
        onSuccess: () => router.push(`/alert/${notice.id}`)
      }
    })
  }

  const SearchButton = () => {
    return (
      <Button type="icon" onClick={ () => props.onToggleSearch(true) }>
        <img src="/images/search.svg" alt="search" tabIndex={-1} />
      </Button>
    )
  }

  const NotificationButton = () => {
    return (
      <div className={ style.NotificationButton }>
        <Button type="icon" onClick={ () => onClickAlertButton() }>
          { userInfo && (userInfo.alertList && userInfo.alertList.findIndex(alert => alert.check_yn === 'N') > -1)
            ? <img src="/images/notification.svg" alt="notification" tabIndex={-1} />
            : <img src="/images/bell.svg" alt="notification" tabIndex={-1} />
          }
        </Button>
        { (popupDisplay && desktop) && <div className={ style.AlertList }>
          { getAlertList() }
        </div> }
      </div>
    )
  }

  const getAlertList = () => {
    const renderAlertCategory = (category: NoticeCode) => {
      switch (category) {
        case NoticeCode.REPLY:
          return '새로운 답글이 등록되었습니다.'
        case NoticeCode.COMMENT:
          return '새로운 댓글이 등록되었습니다.'
      }
    }

    if (!userInfo) return null;

    if (!userInfo.alertList || ('alertList' in userInfo && userInfo.alertList.length === 0)) return <div className={ style.NullAlert }>
      알림창이 비었어요.
    </div>

    return userInfo.alertList.map(alert => (
      <div className={ style.Alert } key={ alert.id } onClick={ () => onReadNotice(alert) }>
        <div className={ style.AlertContent }>
          <div className={ style.AlertCategory }>
            { renderAlertCategory(alert.notice_code) }
          </div>
          <div className={ style.AlertDescription }>
            { alert.description }
          </div> 
        </div>
        { alert.check_yn === 'N' && <div className={ style.NewAlert } /> }
      </div>
    ))
  }

  const ProfileButton = () => {
    const infoMenuList: PopupItemProps[] = [
      // {
      //   text: '내 보드',
      //   onClick: () => Router.push('/board')
      // },
      {
        text: '내 포스트',
        onClick: () => Router.push('/userpost')
      },
      {
        text: '스크랩',
        onClick: () => Router.push('/clipping')
      },
      {
        text: '프로필',
        onClick: () => Router.push('/profile')
      },
      {
        text: '로그아웃',
        onClick: () => signOut()
      },
    ]

    useEffect(() => {
      if (!userInfo) return null
    }, [])

    if (userInfo)
      return (
        <MenuPopup
          type="icon"
          theme="gray"
          menuList={ infoMenuList }
        >
          <UserProfile
            size="xxs"
            profileImage={ userInfo.image ? userInfo.image.uploadedFileURL : '' }
          />
          { !IsMobile() && <p className={ style.Username }>{ userInfo.nickname }</p> }
        </MenuPopup>
      )
  }

  useEffect(() => {
    return () => {
      setPopupDisplay(false)
      setScreenDisplay(false)
    }
  }, [])

  useEffect(() => {
    fetchAlertList()
  }, [postCategory])

  return (
    <>
      <Screen
        display={ screenDisplay }
        content={
          <div className={ style.ScreenAlertList }>
            { getAlertList() }
          </div>
        }
        onCancel={ () => onPrevEvent() }
      />
      <div className={ style.ProfileContainer }>
        <Mobile>
          { userInfo.id
            ? <div className={ style.ButtonContainer }>
              <SearchButton />
              <NotificationButton />
              <ProfileButton />
            </div>
            : <Button theme="primary" type="text" onClick={ () => Router.push("/signin") }>로그인</Button>
          }
        </Mobile>
        <Desktop>
          <div className={ style.ButtoncContainer }>
            { userInfo.id
              ? <>
                { !props.displaySearch
                  ? <SearchButton />
                  : props.search 
                }
                <NotificationButton />
                <ProfileButton />
              </>
              : <>
                <Button type="round" theme="primary" onClick={ () => Router.push("/signin") }>
                  로그인
                </Button>
                <Button type="round" theme="invert" onClick={ () => Router.push("/signup") }>
                  가입
                </Button>
              </>
            }
          </div>
        </Desktop>
      </div>
    </>
  )
}

ProfileContainer.defaultProps = {
  searchCategory: CategoryType.전체
}

export default ProfileContainer