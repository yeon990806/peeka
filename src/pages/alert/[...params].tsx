import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { PostType, StateType } from '@/common/defines/Store';
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const alert = () => {
  const router = useRouter()
  const alertPost = useSelector((state: StateType) => state.user.userInfo.alertDetail)
  const [id] = router.query.params || []

  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    if (!mounted && (!id || !alertPost)) router.push('/community')
  }, [mounted, id, alertPost])
  
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
          ? <PostCard
            post={ alertPost }
            key={ alertPost.id }
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