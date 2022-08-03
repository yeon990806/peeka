import { IsMobile, IsDesktop } from "@/common/hooks/breakpoints";
import UserProfile from "@/components/UserProfile";
import style from "./style.module.scss"

interface UserProfileProps {
  username: string;
  followerCnt: number;
  followingCnt: number;
  userComment: string;
  userImage: string;
  userLink: UserLinkType[]
}

interface UserLinkType {
  serviceName: string;
  serviceLink: string;
}

const ProfileInfo = (props: UserProfileProps) => {
  const { username, followerCnt, followingCnt, userComment, userLink } = props

  return (
    <section className={ style.UserProfile }>
      <div className={ style.UserInfoContainer }>
        <UserProfile profileImage={ props.userImage } size="lg" />
        <div className={ style.UserInfo }>
          <div className={ style.UserName }>
            { username }
          </div>
          <p>
            팔로워
            <span>
              { followerCnt }
            </span>
            <span className={ style.Bar } />
            팔로잉
            <span>
              { followingCnt }
            </span>
          </p>
        </div>
        
      </div>
      <div className={ style.UserComment }>
        { userComment }
      </div>
      <nav className={ style.UserLink }>
        { userLink.map((v, i) => (
          <button key={i} onClick={() => alert(v.serviceName + ' ' + v.serviceLink) }>
            { v.serviceName }
          </button>
        )) }
      </nav>
    </section>
  )
}

export default ProfileInfo