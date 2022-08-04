import style from './style.module.scss'
import { PostType, StateType } from '@/common/defines/Store';
import { useState } from 'react';
import PostCard from '../PostCard';
import { useSelector } from 'react-redux';
import InfiniteScroll from "react-infinite-scroll-component";

interface PostContainerProps {
  postList: PostType[],
  direction: 'top' | 'bottom'
  fetchList: (v: boolean) => void
}

const PostContainer = (props: PostContainerProps) => {
  const [lastId, setLastId] = useState<number | null>(null)
  const fetchLoading = useSelector((state: StateType) => state.post.fetchPostLoading)

  return (
    <div className={ style.PostContainer } id="PostContainer">
      <InfiniteScroll
        dataLength={ props.postList.length }
        next={ () => props.fetchList(false) }
        hasMore={ true }
        loader={ <div>Loading</div> }
        scrollableTarget="PostContainer"
      >
        { props.postList.map(post => (
          <PostCard
            post={ post }
            key={ post.id }
          />
        )) } 
      </InfiniteScroll>
    </div>
  )
}

export default PostContainer