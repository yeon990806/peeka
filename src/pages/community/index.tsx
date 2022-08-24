import PostButton from '@/components/PostButton';
import InputPost from '@/components/InputPost';
import PostContainer from '@/components/PostContainer';
import HashContainer from '@/components/HashContainer';
import Screen from '@/components/Screen';
import { useCallback, useEffect, useState } from "react";
import { LayoutType } from '../_app';
import { useSelector } from 'react-redux';
import { StateType, StorePostType } from '@/common/defines/Store'
import { useDispatch } from 'react-redux';
import { CHANGE_POST_CATEGORY, EMPTY_MAIN_POST, FETCH_POST_REQUEST } from '@/store/reducer/post';
import { IsMobile } from '@/common/hooks/breakpoints';

import style from "./style.module.scss"
import Loader from '@/components/Loader';

const Community = () => {
  const mobile = IsMobile()
  const dispatch = useDispatch()
  const postCategory = useSelector((state: StateType, ) => state.post.postCategory)
  const postLoading = useSelector((state: StateType) => state.post.fetchPostLoading)
  const postDone = useSelector((state: StateType) => state.post.fetchDone)
  const postError = useSelector((state: StateType) => state.post.fetchPostError)
  const postList = useSelector((state: StateType) => state.post.mainPost)
  const isLogin = useSelector((state: StateType) => state.user.userInfo)
  
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
  
  try {

    return (
      <div className={ style.Community }>
        { postLoading && <Loader /> }
        { mobile
          ? <HashContainer />
          : <>
            { isLogin.id && <InputPost
              additionalClass={ style.CommunityInputPost }
              placeholder="현재 떠오르는 생각들을 적어주세요"
            /> } 
          </> 
        }
        <div className={ style.CommunityPost }>
          { postList.length > 0 && <PostContainer
            fetchDone={ postDone }
            fetchError={ postError }
            fetchList={() => fetchPost(false, postLoading)}
            fetchLoading={ postLoading }
            postList={postList}
            postType={ StorePostType.MainPost }
          /> }
        </div>
        { mobile && isLogin.id && <PostButton
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
  } catch (err) {
    console.error(err)
  }
}

Community.getLayout = LayoutType.App

export default Community