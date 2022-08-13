import style from './style.module.scss'
import { PostType, StorePostType } from '@/common/defines/Store';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import PostCard from '../PostCard';
import { useState } from 'react';
import TopButton from '../TopButton';

export interface PostContainerProps {
  postType: StorePostType,
  postList: PostType[],
  fetchLoading: boolean,
  fetchList?: (initPost, loading, lastId?) => void,
}

const PostContainer = (props: PostContainerProps) => {
  const trigger = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState<number>(0)

  const onFollow = () => useCallback(() => setScrollY(container.current.scrollTop), [scrollY])

  const handleObserver = useCallback(entries => {
    const target = entries[0];
    if (target.isIntersecting && props.fetchList) {
      return props.fetchList(false, props.fetchLoading)
    }
  }, [props.postList]);

  const TopButtonStyle = useMemo(() => ({
    top: 80,
    left: 0,
    right: 0,
    margin: '0 auto',
  }), [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0
    });

    if (trigger.current) observer.observe(trigger.current);
  }, [handleObserver]);

  useEffect(() => {
    console.log(scrollY)
  }, [scrollY])

  return (
    <div className={ style.PostContainer } ref={ container }>
      <TopButton
        style={ TopButtonStyle }
        onClick={ () => {} }
      />
      { props.postList.map((post, i) => (
        <PostCard
          type={ props.postType }
          post={ post }
          key={ post.id }
        />
      )) }
      { (props.postList.length >= 20 && props.fetchList) && <div ref={ trigger } /> }
    </div>
  )
}

export default PostContainer