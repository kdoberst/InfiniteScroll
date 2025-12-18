
import React from 'react';
import { useFetchTodos } from '../../infiniteScrollDemo/fetchPosts';
import { InfiniteScroll } from '@app/InfiniteScroll';
import { useLoadingConfig } from '@app/infiniteScrollDemo/LoadingContext';
import { Post } from '@app/infiniteScrollDemo/Post';

export default function TodosFeed() {
  const [posts, setPosts] = React.useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [endOfData, setEndOfData] = React.useState(false);
  const { fetchtods } = useFetchTodos();
  const { itemsPerPage } = useLoadingConfig();

  const fetchMoreItems = React.useCallback(
    async (page: number) => {
      setIsLoading(true);
      const newPosts = await fetchtods(page);
      setPosts((prevPosts) => [...prevPosts, ...newPosts.map((post) => <Post post={post} key={post.id} />)]);
      setEndOfData(newPosts.length === 0);
      setIsLoading(false);
    },
    [fetchtods],
  );

  return (
   
      <InfiniteScroll
        items={posts}
        fetchMoreItems={fetchMoreItems}
        endOfData={endOfData}
        isLoading={isLoading}
        itemsPerPage={itemsPerPage}
        ariaFeedLabel="Sample todos"
        feedTitle="Todos"
      />

  );
}
