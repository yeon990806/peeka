import { useMediaQuery } from 'react-responsive';
import { useCallback, useEffect, useState } from "react";
import PostButton from '@/components/PostButton';
import InputPost from '@/components/InputPost';

import style from "./style.module.scss"
import HashContainer from '@/components/HashContainer';
import Screen from '@/components/Screen';
import { LayoutType } from '../_app';
import { useSelector } from 'react-redux';
import { StateType } from '@/common/defines/Store'
import { useDispatch } from 'react-redux';
import { CHANGE_POST_CATEGORY, FETCH_POST_REQUEST } from '@/store/reducer/post';
import PostContainer from '@/components/PostContainer';

const Community = () => {
  const dispatch = useDispatch()
  const postCategory = useSelector((state: StateType) => state.post.postCategory)
  const postArray = useSelector((state: StateType) => state.post.mainPost)
  const isLogin = useSelector((state: StateType) => state.user.userInfo)

  const [displayInputPopup, setDisplayInputPoup] = useState<boolean>(false)
  const [showing, setShowing] = useState<boolean>(false);


  const isMobile = useMediaQuery({
    query: '(max-width: 1023px)',
  })

  const toggleDisplayInputPopup = useCallback(() => setDisplayInputPoup(prev => !prev), [])

  const fetchPost = (initPost: boolean) => {
    if (FETCH_POST_REQUEST)
      dispatch({
        type: FETCH_POST_REQUEST,
        data: {
          id: postArray.length > 0 ? postArray[0].id : '',
          paging_number: 0,
          paging_size: 20,
          category_code: postCategory,
          initPost
        }
      })
  }

  useEffect(() => {
    setShowing(true);
  }, [showing]);

  useEffect(() => {
    fetchPost(true)
  }, [postCategory])

  useEffect(() => {
    return () => {
      dispatch({
        type: CHANGE_POST_CATEGORY,
        data: null,
      })
    }
  }, [])

  if (!showing) return <></>
  return (
    <div className={ style.Community }>
      {/* { fetchPostLoading && <Spinner /> } */}
      { isMobile ? <HashContainer /> : <InputPost /> }
      <PostContainer
        fetchList={ () => fetchPost(false) }
        postList={ postArray }
        direction='top'
      />
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
    </div>
  );
}

Community.getLayout = LayoutType.App

export default Community