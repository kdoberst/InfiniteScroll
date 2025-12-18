import { Grid, GridItem, PageSection, Title } from '@patternfly/react-core';
import React from 'react';
import PostsFeed from './MultipleContent/PostsFeed';
import TodosFeed from './MultipleContent/TodosFeed';

export default function Multiple() {
  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Multiple content example
      </Title>
      <p>This example shows multiple infinite scroll feeds on a single page.</p>
      <Grid>
        <GridItem span={6}>
          <PostsFeed />
        </GridItem>
        <GridItem span={6}>
          <TodosFeed />
        </GridItem>
      </Grid>
    </PageSection>
  );
}
