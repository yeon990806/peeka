import style from './style.module.scss'
import { PostType, StorePostType } from '@/common/defines/Store';
import { useCallback, useEffect, useRef } from 'react';
import PostCard from '../PostCard';

export interface PostContainerProps {
  postType: StorePostType,
  postList: PostType[],
  fetchLoading: boolean,
  fetchError: boolean,
  fetchDone: boolean,
  fetchList?: (initPost, loading, lastId?) => void,
}

const PostContainer = (props: PostContainerProps) => {
  const trigger = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(entries => {
    const target = entries[0];
    if (target.isIntersecting) {
      if (props.fetchList && !props.fetchError) props.fetchList(false, props.fetchLoading)
    }
  }, [props.postList]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0
    });

    if (trigger.current) observer.observe(trigger.current);
  }, [handleObserver]);

  return (
    <div className={ style.PostContainer }>
      { props.postList.map((post, i) => (
        <PostCard
          type={ props.postType }
          post={ post }
          key={ post.id }
        />
      )) }
      { (props.postList.length >= 20 && props.fetchList && !props.fetchDone && !props.fetchError) && <div className={ style.Trigger } ref={ trigger } /> }
    </div>
  )
}

export default PostContainer