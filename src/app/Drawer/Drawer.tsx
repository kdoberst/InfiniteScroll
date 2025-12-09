import * as React from 'react';
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

import PostsList from '../infiniteScrollDemo/PostsLists';
import PageBodyContent from './PageBodyContent';

const Drawer: React.FunctionComponent = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

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
          <PostsList isInDrawer />
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
            <Content component={ContentVariants.p}>
              <Button aria-expanded={isExpanded} onClick={onClick}>
                Toggle drawer with focus trap
              </Button>
            </Content>
            <PageBodyContent />
          </PageSection>
        </DrawerContentBody>
      </DrawerContent>
    </PFDrawer>
  );
};

export { Drawer };
