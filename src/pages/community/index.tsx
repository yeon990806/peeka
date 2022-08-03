import { useMediaQuery } from 'react-responsive';
import PostCard from "@/components/PostCard";
import { useCallback, useEffect, useState } from "react";
import PostButton from '@/components/PostButton';
import InputPost from '@/components/InputPost';

import style from "./style.module.scss"
import RealTimeRanking from '@/components/RealTimeRanking';
import HashContainer from '@/components/HashContainer';
import Screen from '@/components/Screen';
import { LayoutType } from '../_app';
import { useSelector } from 'react-redux';
import { StateType } from '@/common/defines/Store';
import { PostType } from '@/common/defines/Store';
import { useDispatch } from 'react-redux';
import { FETCH_POST_REQUEST } from '@/store/reducer/post';
import { convertStateBoolean } from '@/common/defines/Format';
import Spinner from '@/components/Spinner';

const Community = () => {
  const dispatch = useDispatch()
  const postCategory = useSelector((state: StateType) => state.post.postCategory)
  const postArray = useSelector((state: StateType) => state.post.mainPost)
  const isLogin = useSelector((state: StateType) => state.user.userInfo)
  const fetchedAllPost = useSelector((state: StateType) => state.post.fetchedAllPost)
  const fetchPostLoading = useSelector((state: StateType) => state.post.fetchPostLoading)

  const [displayInputPopup, setDisplayInputPoup] = useState<boolean>(false)
  const [showing, setShowing] = useState<boolean>(false);


  const isMobile = useMediaQuery({
    query: '(max-width: 1023px)',
  })
  const wideScreen = useMediaQuery({
    query: '(min-width: 1400px)',
  })

  const toggleDisplayInputPopup = useCallback(() => setDisplayInputPoup(prev => !prev), [])

  const fetchPost = useCallback((initPost: boolean) => dispatch({
    type: FETCH_POST_REQUEST,
    data: {
      id: "",
      paging_number: 0,
      paging_size: 20,
      category_code: postCategory,
      initPost
    },
  }), [postCategory])

  useEffect(() => {
    setShowing(true);

    if (!fetchPostLoading && showing) fetchPost(true)
  }, [showing]);

  useEffect(() => {
    fetchPost(true)
  }, [postCategory])

  // useEffect(() => {
  //   const scrollEvent = () => {
  //     if (window.scrollY + document.documentElement.clientHeight > Math.max(document.documentElement.scrollHeight - 300, document.documentElement.scrollHeight * 0.93) && !fetchedAllPost && !fetchPostLoading) debugger
  //       dispatch({
  //         type: FETCH_POST_REQUEST,
  //       })
  //   }

  //   window.addEventListener('scroll', scrollEvent)

  //   return () => {
  //     window.removeEventListener('scroll', scrollEvent)
  //   }
  // }, [fetchedAllPost])

  if (!showing) return <></>
  return (
    <>
      { fetchPostLoading && <Spinner /> }
      { isMobile ? <HashContainer /> : <InputPost /> }
      <div className={ style.Community }>
        { postArray.map((v: PostType) => (
          <PostCard
            post={ v }
            key={ v.id }
          />
        )) }
      </div>
      { wideScreen && <RealTimeRanking /> }
      { isMobile && isLogin && <PostButton
        onClick={ () => toggleDisplayInputPopup() }
      /> }
      <Screen
        display={ displayInputPopup }
        content={
          <>
            <InputPost
              popup
              placeholder="현재 떠오르는 생각들을 적어주세요"
              onSubmit={ () => toggleDisplayInputPopup() }
            />
          </>
        }
        onCancel={ () => toggleDisplayInputPopup() }
      />
    </>
  );
}

Community.getLayout = LayoutType.App

export default Community