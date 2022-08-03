import { CategoryType } from "@/common/defines/Category";
import { alertType, StateType } from "@/common/defines/Store";
import { Desktop, Mobile, IsMobile, IsDesktop } from "@/common/hooks/breakpoints";
import Button from "@/components/Button";
import Input from "@/components/Input";
import MenuPopup, { PopupItemProps } from "@/components/MenuPopup";
import { dispatchSignOut, FETCH_ALERT_REQUEST } from "@/store/reducer/user";
import Router from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.scss"
import Screen from "@/components/Screen";
import UserProfile from "@/components/UserProfile";

interface ProfileContainerProps {
  toggleSearch?: boolean;
  searchText?: string;
  searchCategory?: CategoryType;
  onToggleSearch?: () => void;
}

const ProfileContainer = (props: ProfileContainerProps) => {
  const desktop = IsDesktop()
  const dispatch = useDispatch()
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const [popupDisplay, setPopupDisplay] = useState<boolean>(false)
  const [screenDisplay, setScreenDisplay] = useState<boolean>(false)

  const signOut = useCallback(() => dispatch(dispatchSignOut()), [])

  const onClickAlertButton = useCallback(() => {
    if (desktop) setPopupDisplay(prev => !prev)
    else setScreenDisplay(prev => !prev)
  }, [popupDisplay, screenDisplay, desktop])
  
  const onPrevEvent = useCallback(() => setScreenDisplay(prev => !prev), [screenDisplay]) 

  const SearchButton = () => {
    return <Button type="icon" onClick={ () => props.onToggleSearch() }>
      <img src="/images/search.svg" alt="search" tabIndex={-1} />
    </Button>
  }

  const NotificationButton = () => {
    return (
      <div className={ style.NotificationButton }>
        <Button type="icon" onClick={ () => onClickAlertButton() }>
          { userInfo && (userInfo.alertList && userInfo.alertList.length > 0)
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
    if (!userInfo) return null;

    if (!userInfo.alertList || ('alertList' in userInfo && userInfo.alertList.length === 0)) return <div className={ style.NullAlert }>
      알림창이 비었어요.
    </div>

    return userInfo.alertList.map(alert => (
      <div className={ style.Alert } key={ alert.id }>
        { alert.description }
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

      dispatch({
        type: FETCH_ALERT_REQUEST,
        data: {
          id: (userInfo && (userInfo.alertList && userInfo.alertList.length > 0)) ? userInfo.alertList[0].id : ''
        }
      })
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

  const SearchInput = () => {
    return <Input
      searchInput
      placeholder="검색어를 입력하세요."
      value={ props.searchText }
      prefix={
        <Button
          type="search"
        >
          { props.searchCategory }
        </Button>
      }
      postfix={ <Button type="icon">
        <img src="/images/search.svg" alt="search" />
      </Button> }
    />
  }

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
          { userInfo
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
            { props.toggleSearch
              ? <SearchInput />
              : <SearchButton />
            }
            { userInfo
              ? <>
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