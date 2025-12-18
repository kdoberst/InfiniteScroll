import { PageSection, Title } from '@patternfly/react-core';
import React from 'react';
import { useFetchPosts } from '../infiniteScrollDemo/fetchPosts';
import { Post } from '../infiniteScrollDemo/Post';
import { InfiniteScroll } from '@app/InfiniteScroll';
import { useLoadingConfig } from '@app/infiniteScrollDemo/LoadingContext';

export default function OnlyLoadMore() {
  const { fetchPosts } = useFetchPosts();
  const { itemsPerPage } = useLoadingConfig();
  const [posts, setPosts] = React.useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [endOfData, setEndOfData] = React.useState(false);

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
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Load more button only example
      </Title>
      <p>This example shows the infinite scroll component with only the "Load more" button. Infinite scroll is not available as an option.</p>
      <InfiniteScroll
        items={posts}
        fetchMoreItems={fetchMoreItems}
        endOfData={endOfData}
        isLoading={isLoading}
        itemsPerPage={itemsPerPage}
        ariaFeedLabel="Sample posts"
        feedTitle="Posts"
        onlyAllowLoadMoreButton={true}
      />
    </PageSection>
  );
}
