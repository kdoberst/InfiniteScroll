import { PageSection, Switch, Title } from '@patternfly/react-core';
import React from 'react';
import { useFetchPosts } from '../infiniteScrollDemo/fetchPosts';
import { InfiniteScroll } from '@app/InfiniteScroll';
import { useLoadingConfig } from '@app/infiniteScrollDemo/LoadingContext';
import { Post } from '@app/infiniteScrollDemo/Post';

export default function DetachedConfig() {
  const [posts, setPosts] = React.useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [endOfData, setEndOfData] = React.useState(false);
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = React.useState(true);
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
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Detached config example
      </Title>
      <p>
        This example shows how to use the infinite scroll component with a detached configuration instead of using the built-in toggle.
      </p>
      <Switch
        label={`Enable infinite scroll (custom toggle)`}
        id="checked-with-label-switch-on"
        isChecked={isInfiniteScrollEnabled}
        hasCheckIcon
        onChange={() => setIsInfiniteScrollEnabled(!isInfiniteScrollEnabled)}
      />

      <InfiniteScroll
        items={posts}
        fetchMoreItems={fetchMoreItems}
        endOfData={endOfData}
        isLoading={isLoading}
        itemsPerPage={itemsPerPage}
        ariaFeedLabel="Sample posts"
        feedTitle="Posts"
        isInfiniteScrollEnabled={isInfiniteScrollEnabled}
      />
    </PageSection>
  );
}
