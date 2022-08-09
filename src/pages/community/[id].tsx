import PostButton from '@/components/PostButton';
import InputPost from '@/components/InputPost';
import PostContainer from '@/components/PostContainer';
import HashContainer from '@/components/HashContainer';
import Screen from '@/components/Screen';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { StateType, StorePostType } from '@/common/defines/Store'
import { CHANGE_POST_CATEGORY, EMPTY_MAIN_POST, FETCH_POST_REQUEST } from '@/store/reducer/post';
import { LayoutType } from '../_app';
import { useCallback, useEffect, useState } from "react";
import { IsMobile } from '@/common/hooks/breakpoints';

import style from "./style.module.scss"
import { debug } from 'console';

const Community = () => {
  const mobile = IsMobile()
  const router = useRouter()
  const dispatch = useDispatch()
  const postCategory = useSelector((state: StateType, ) => state.post.postCategory)
  const postLoading = useSelector((state: StateType) => state.post.fetchPostLoading)
  const postList = useSelector((state: StateType) => state.post.mainPost)
  const isLogin = useSelector((state: StateType) => state.user.userInfo)
  const id = router.query.id

  const [displayInputPopup, setDisplayInputPoup] = useState<boolean>(false)
  const [showing, setShowing] = useState<boolean>(false);

  const toggleDisplayInputPopup = useCallback(() => setDisplayInputPoup(prev => !prev), [displayInputPopup])

  const fetchPost = useCallback((initPost: boolean, loading: boolean, step?: string) => {
    const lastId = postList.length > 0 ? postList[postList.length - 1].id : ''
    
    if (!initPost && !lastId) return
    if (!loading)
      dispatch({
        type: FETCH_POST_REQUEST,
        data: {
          id: lastId || '',
          paging_number: 0,
          paging_size: 20,
          category_code: postCategory,
          initPost
        }
      })
  }, [postList])

  useEffect(() => {
    setShowing(true)
    fetchPost(true, postLoading)

    return () => {
      dispatch({
        type: CHANGE_POST_CATEGORY,
        data: null,
      })

      dispatch({
        type: EMPTY_MAIN_POST
      })
    }
  }, [])

  useEffect(() => {
    if (!postCategory)
      dispatch({
        type: CHANGE_POST_CATEGORY,
        data: 'NULL'
      })
  }, [postCategory])

  if (!showing) return <></>
  return (
    <div className={ style.Community }>
      {/* { fetchPostLoading && <Spinner리 /> } */}
      { mobile ? <HashContainer /> : <InputPost /> }
      { postList.length > 0 && <PostContainer
        fetchList={() => fetchPost(false, postLoading)}
        fetchLoading={ postLoading }
        postList={postList}
        postType={ StorePostType.MainPost }
      /> }
      { mobile && isLogin && <PostButton
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