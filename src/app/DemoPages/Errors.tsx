import { PageSection, Title } from '@patternfly/react-core';
import React from 'react';
import { useFetchPosts } from '../infiniteScrollDemo/fetchPosts';
import { InfiniteScroll } from '@app/InfiniteScroll';
import { useLoadingConfig } from '@app/infiniteScrollDemo/LoadingContext';
import { Post } from '@app/infiniteScrollDemo/Post';

export default function Errors() {
  const [posts, setPosts] = React.useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [endOfData, setEndOfData] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { fetchPosts } = useFetchPosts();
  const { itemsPerPage } = useLoadingConfig();
  const [numberOfErrors, setNumberOfErrors] = React.useState(0);

  const fetchMoreItems = React.useCallback(
    async (page: number) => {
     
      setIsLoading(true);
      setError(null);
      const newPosts = await fetchPosts(page);
      if (numberOfErrors <2  && page === 2){
        setNumberOfErrors(numberOfErrors + 1);
        setError(new Error('Error loading posts'));
      }else{
      setPosts((prevPosts) => [...prevPosts, ...newPosts.map((post) => <Post post={post} key={post.id} />)]);
      setEndOfData(newPosts.length === 0);
      }
      setIsLoading(false);
    },
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchPosts],
  );

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Error handling example
      </Title>
      <p>This example shows the infinite scroll component with error handling. The error message will be displayed twice before the error is resolved.</p>
      <InfiniteScroll
        items={posts}
        fetchMoreItems={fetchMoreItems}
        endOfData={endOfData}
        isLoading={isLoading}
        itemsPerPage={itemsPerPage}
        ariaFeedLabel="Sample posts"
        feedTitle="Posts"
        loadingDataErrorMessage={error?.message ?? undefined}
      />
    </PageSection>
  );
}
