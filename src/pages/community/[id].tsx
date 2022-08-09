import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { StateType, StorePostType } from '@/common/defines/Store'
import { CHANGE_POST_CATEGORY, EMPTY_MAIN_POST } from '@/store/reducer/post';
import { LayoutType } from '../_app';
import { useEffect, useState } from "react";

import style from "./style.module.scss"
import { FETCH_LINKEDPOST_REQUEST } from '@/store/reducer/extra';
import PostCard from '@/components/PostCard';

const Community = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id || ""

  const postList = useSelector((state: StateType) => state.extra.extraList)

  const [showing, setShowing] = useState<boolean>(false);

  const fetchPost = () => {
    if (!id) return
    dispatch({
      type: FETCH_LINKEDPOST_REQUEST,
      data: {
        id,
      }
    })
  }

  useEffect(() => {
    setShowing(true)

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
    if (id) fetchPost()
  }, [id])

  if (!showing) return <></>
  return (
    <div className={ style.Community }>
      { postList.length > 0 && <PostCard
        post={ postList[0] }
        type={ StorePostType.ExtraPost }
      /> }
    </div>
  );
}

Community.getLayout = LayoutType.App

export default Community