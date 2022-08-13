import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { StateType, StorePostType } from '@/common/defines/Store';
import PostCard from "@/components/PostCard";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import PostContainer from "@/components/PostContainer";

const alert = () => {
  const router = useRouter()
  const alertPost = useSelector((state: StateType) => state.user.userInfo.alertDetail)
  const id = router.query.id || ""

  return (
    <div className={ style.MyPost }>
      <div className={ style.PageHeader }>
        <img src="/images/bell.svg" tabIndex={-1} role="presentation" />
        <h1>
          알림
        </h1>
      </div>
      <div className={ style.PostContainer }>
        { alertPost
          ? <PostContainer
              fetchLoading
              fetchDone
              postType={StorePostType.Alert}
              postList={ alertPost }
            />
          : <div className={ style.NullContent }>
            <h1>상세 알림이 없어요.</h1>
          </div>
        }
      </div>
    </div>
  )
}

alert.getLayout = LayoutType.App

export default alert