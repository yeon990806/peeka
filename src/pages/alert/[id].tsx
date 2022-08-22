import { LayoutType } from "../_app"
import style from "./style.module.scss"
import { StateType, StorePostType } from '@/common/defines/Store';
import PostCard from "@/components/PostCard";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import PostContainer from "@/components/PostContainer";
import ExtraPage from "@/components/ExtraPage";

const alert = () => {
  const router = useRouter()
  const alertPost = useSelector((state: StateType) => state.user.userInfo.alertDetail)
  const id = router.query.id || ""

  return (
    <ExtraPage
      img={
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.44784 7.96942C6.76219 5.14032 9.15349 3 12 3V3C14.8465 3 17.2378 5.14032 17.5522 7.96942L17.804 10.2356C17.8072 10.2645 17.8088 10.279 17.8104 10.2933C17.9394 11.4169 18.3051 12.5005 18.8836 13.4725C18.8909 13.4849 18.8984 13.4973 18.9133 13.5222L19.4914 14.4856C20.0159 15.3599 20.2782 15.797 20.2216 16.1559C20.1839 16.3946 20.061 16.6117 19.8757 16.7668C19.5971 17 19.0873 17 18.0678 17H5.93223C4.91268 17 4.40291 17 4.12434 16.7668C3.93897 16.6117 3.81609 16.3946 3.77841 16.1559C3.72179 15.797 3.98407 15.3599 4.50862 14.4856L5.08665 13.5222C5.10161 13.4973 5.10909 13.4849 5.11644 13.4725C5.69488 12.5005 6.06064 11.4169 6.18959 10.2933C6.19123 10.279 6.19283 10.2645 6.19604 10.2356L6.44784 7.96942Z" stroke="#E3E3E3" strokeWidth="1.7"/>
          <path d="M9.10222 17.6647C9.27315 18.6215 9.64978 19.467 10.1737 20.0701C10.6976 20.6731 11.3396 21 12 21C12.6604 21 13.3024 20.6731 13.8263 20.0701C14.3502 19.467 14.7269 18.6215 14.8978 17.6647" stroke="#E3E3E3" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      }
      title="알림"
      postList={ alertPost }
      postType={ StorePostType.Alert }
      nullText={
        <div>
          <h1>상세 알림이 없어요.</h1>
        </div>
      }
    />
  )
}

alert.getLayout = LayoutType.App

export default alert