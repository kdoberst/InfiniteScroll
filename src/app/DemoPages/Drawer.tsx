import React from 'react';
import {
  Button,
  Content,
  ContentVariants,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Drawer as PFDrawer,
  PageSection,
  Title,
} from '@patternfly/react-core';

import SampleBodyContent from './SampleBodyContent';
import { useFetchPosts } from '@app/infiniteScrollDemo/fetchPosts';
import { Post } from '@app/infiniteScrollDemo/Post';
import { InfiniteScroll } from '@app/InfiniteScroll/';
import { useLoadingConfig } from '@app/infiniteScrollDemo/LoadingContext';

export default function Drawer() {
  const { fetchPosts } = useFetchPosts();
  const { itemsPerPage } = useLoadingConfig();
  const [isExpanded, setIsExpanded] = React.useState(false);
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

  const onClick = () => {
    setIsExpanded(!isExpanded);
  };

  const onCloseClick = () => {
    setIsExpanded(false);
  };

  // An onKeyDown property must be passed to the Drawer component to handle closing
  // the drawer panel and deactivating the focus trap via the Escape key.
  const onEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsExpanded(false);
    }
    if ((event.key === 'End' || event.code === 'End') && (event.ctrlKey || event.metaKey)) {
      setIsExpanded(false);
    }
  };

  const panelContent = (
    <DrawerPanelContent focusTrap={{ enabled: true }}>
      <DrawerHead>
        <span>Drawer panel header</span>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody>
        <div style={{ overflowY: 'auto' }}>
          <InfiniteScroll
            items={posts}
            fetchMoreItems={fetchMoreItems}
            endOfData={endOfData}
            isLoading={isLoading}
            itemsPerPage={itemsPerPage}
            ariaFeedLabel="Sample posts"
            feedTitle="Posts"
            isInDrawer={true}
          />
        </div>
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  return (
    <PFDrawer onKeyDown={onEscape} isExpanded={isExpanded}>
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>
          <PageSection hasBodyWrapper={false}>
            <Title headingLevel="h1" size="lg">
              Drawer Demo Page
            </Title>
            <p>This example shows the infinite scroll component in a drawer.</p>
            <Content component={ContentVariants.p}>
              <Button aria-expanded={isExpanded} onClick={onClick}>
                Toggle drawer with focus trap
              </Button>
            </Content>
            <SampleBodyContent />
          </PageSection>
        </DrawerContentBody>
      </DrawerContent>
    </PFDrawer>
  );
}
