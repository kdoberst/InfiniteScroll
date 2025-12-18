
import React from 'react';
import { useFetchPosts } from '../../infiniteScrollDemo/fetchPosts';
import { InfiniteScroll } from '@app/InfiniteScroll';
import { useLoadingConfig } from '@app/infiniteScrollDemo/LoadingContext';
import { Post } from '@app/infiniteScrollDemo/Post';

export default function PostsFeed() {
  const [posts, setPosts] = React.useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [endOfData, setEndOfData] = React.useState(false);
  const { fetchPosts } = useFetchPosts();
  const { itemsPerPage } = useLoadingConfig();

  const fetchMoreItems = React.useCallback(
    async (page: number) => {
      setIsLoading(true);
      const newPosts = await fetchPosts(page);
      setPosts((prevPosts) => [...prevPosts, ...newPosts.map((post) => <Post post={post} key={post.id} />)]);
      setEndOfData(newPosts.length === 0);
      setIsLoading(false);
    },
    [fetchPosts],
  );

  return (
   
      <InfiniteScroll
        items={posts}
        fetchMoreItems={fetchMoreItems}
        endOfData={endOfData}
        isLoading={isLoading}
        itemsPerPage={itemsPerPage}
        ariaFeedLabel="Sample posts"
        feedTitle="Posts"
      />

  );
}
