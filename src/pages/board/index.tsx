import { IsDesktop } from "@/common/hooks/breakpoints";
import PostCard from "@/components/PostCard";
import TabHost, { TabItemType } from "@/components/TabHost";
import { useEffect, useState } from "react";
import UserProfile from "./components/ProfileInfo"

import style from "./style.module.scss";
import { useSelector } from 'react-redux';
import { PostType, StateType } from "@/common/defines/Store";
import router from 'next/router';
import { LayoutType } from "../_app";

const board = () => {
  const userInfo = useSelector((state: StateType) => state.user.userInfo)
  const allPost = useSelector((state: StateType) => state.post.mainPost)
  const [userPost, setUserPost] = useState<PostType[]>([])

  const [tabArray, setTabArray] = useState<TabItemType[]>([
    { tabName: "포스팅", isSelected: true },
    { tabName: "팔로잉", isSelected: false },
    { tabName: "스크랩", isSelected: false }
  ]);

  const onClickTabArray = (idx: number) => {
    const copiedItem = tabArray[idx]


  }

  const userLinkArr = [
    {
      serviceName: "인스타그램",
      serviceLink: "https://www.instagram.com/bryceharper3/"
    }
  ]

  useEffect(() => {
    if (!userInfo) router.push('/community')

    return () => {
      setUserPost([])
    }
  }, [userInfo])

  if (!userInfo) return null
  return (
    <>
      <div className={ style.ProfileContainer }>
        {/* <UserProfile
          username={ userInfo.username }
          userImage={ userInfo.userImage }
          userComment={ userInfo.intro }
          userLink={ userLinkArr }
        /> */}
        { IsDesktop && <TabHost tabArray={ tabArray } /> }
      </div>
      <div className={ style.PostContainer }>
        { !IsDesktop && <TabHost tabArray={ tabArray } /> }
        { /** TODO:: Tabhost 상세 구현 */ }
        {/* { userPost.map(v => (
          <Post
            key={ v.idx }
            idx={ v.id }
            author={ v.nick_name }
            category={ v.category }
            timeAgo={ v.timeAgo }
            abstract={ v.abstract }
            likeCount={ v.likeCount }
            images={ v.images }
            comments={ v.comments }
          />
        )) } */}
      </div>
    </>
  )
}

board.getLayout = LayoutType.App

export default board