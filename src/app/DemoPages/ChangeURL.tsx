import { PageSection, Title } from '@patternfly/react-core';
import React, { useRef } from 'react';
import { useFetchPosts } from '../infiniteScrollDemo/fetchPosts';
import { InfiniteScroll } from '@app/InfiniteScroll/';
import { useLoadingConfig } from '@app/infiniteScrollDemo/LoadingContext';
import { Post } from '@app/infiniteScrollDemo/Post';
import { useSearchParams } from 'react-router-dom';


export default function ChangeURL() {
  const { fetchPosts } = useFetchPosts();
  const { itemsPerPage } = useLoadingConfig();
  const [posts, setPosts] = React.useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [endOfData, setEndOfData] = React.useState(false);
  const [searchPage, setSearchPage] = useSearchParams();
  const page = searchPage.get('page') ? Number(searchPage.get('page')) : 1;
  const hasLoadedInitialPagesRef = useRef(false);

  const fetchMoreItems = React.useCallback(
    async (page: number) => {
      setIsLoading(true);

      // On initial load, if page > 1, load all pages from 1 to page sequentially
      if (!hasLoadedInitialPagesRef.current && page > 1 && posts.length === 0) {
        hasLoadedInitialPagesRef.current = true;
        const allPosts: React.ReactNode[] = [];
        let foundEndOfData = false;

        // Load pages 1 through page sequentially to preserve order
        for (let pageNum = 1; pageNum <= page; pageNum++) {
          const newPosts = await fetchPosts(pageNum);
          if (newPosts.length === 0) {
            foundEndOfData = true;
            break;
          }
          // Add posts in order: page 1 first, then page 2, then page 3, etc.
          allPosts.push(...newPosts.map((post) => <Post post={post} key={post.id} />));
        }

        setPosts(allPosts);
        setEndOfData(foundEndOfData);
      } else {
        // Normal case: load just the requested page
        const newPosts = await fetchPosts(page);
        setPosts((prevPosts) => [...prevPosts, ...newPosts.map((post) => <Post post={post} key={post.id} />)]);
        setEndOfData(newPosts.length === 0);
      }

      setIsLoading(false);
      // Update URL search param with the new page number
      setSearchPage((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', page.toString());
        return newParams;
      });
    },
    [fetchPosts, setSearchPage, posts.length],
  );

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Change URL with page change
      </Title>
      <p>This example automatically updates the URL when the page changes.</p>
      <InfiniteScroll
        items={posts}
        fetchMoreItems={fetchMoreItems}
        endOfData={endOfData}
        isLoading={isLoading}
        itemsPerPage={itemsPerPage}
        ariaFeedLabel="Sample posts"
        feedTitle="Posts"
        initialPage={page}
      />
    </PageSection>
  );
}
