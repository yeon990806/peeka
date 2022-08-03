import UserProfile from '../UserProfile/index';

import style from "./style.module.scss"
import Button from '@/components/Button';

interface ItemProps {
  username: string;
  userAccount: string;
  following: boolean;
  userComment: string;
}

const Item = (props: ItemProps) => {
  return (
    <li className={ style.Item }>
      <UserProfile size="sm" />
      <div className={ style.ItemUserInfo }>
        <div className={ style.UserInfoContainer }>
          <div className={ style.UserInfo }>
            <div className={ style.UserInfoUsername }>
              { props.username }
            </div>
            <div className={ style.UserInfoUserAccount }>
              { props.userAccount }
            </div>
          </div>
          <div className={ style.UserAction }>
            <Button
              type="round"
              theme={ props.following ? "primary" : "dark" }
            >
              { props.following ? "팔로잉" : "팔로우" }
            </Button>
            <Button type="icon">
              <img src="/iamges/more.svg" tabIndex={-1} alt="more" />
            </Button>
          </div>
        </div>
        <div className={ style.UserComment }>
          { props.userComment }
        </div>
      </div>
    </li>
  )
}

Item.DefaultProps = {
  username: "Peeka123",
  userAccount: "peekapeeka"
}

export default Item