import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

import PostsList from '../infiniteScrollDemo/PostsLists';

const Dashboard: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <Title headingLevel="h1" size="lg">Dashboard Page Title!</Title>
    <PostsList />
  </PageSection>
)

export { Dashboard };
