import { PageSection, Title } from '@patternfly/react-core';
import React from 'react';

export default function About() {
  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        About this project
      </Title>
      <p>This repository contains a more accessible infinite scroll component built with PatternFly and React.</p>
      <p>The component is built with the following features:</p>
      <ul>
        <li>Automatic infinite scroll</li>
        <li>Manual Load more button</li>
        <li>Keyboard navigation</li>
        <li>Focus management</li>
        <li>Prevents duplicate page loads</li>
      </ul>
      <p>
        The component follows the{' '}
        <a href="https://www.w3.org/WAI/ARIA/apg/patterns/feed/examples/feed/">W3C ARIA practices</a> for infinite
        scroll.
      </p>
      <h2>Using the component</h2>
      <p>To use the component, you need to pass the following props:</p>
      <ul>
        <li>
          items: An array of items to display{' '}
          <ul>
            <li>These should be React components.</li>
            <li>The component needs to have a heading</li>
            <li>The component should not be wrapped in an article tag - the infinite scroll components will do this</li>
          </ul>
        </li>
        <li>fetchMoreItems: A function to fetch more items</li>
        <li>endOfData: A boolean indicating if all data has been loaded</li>
        <li>isLoading: A boolean indicating if items are currently being loaded</li>
      </ul>
      <p>
        In addition, the option to turn off infinite scroll should be provided to all users, including pointer
        device and keyboard users. Note that by default, a settings button will be displayed that opens a popover
        allowing users to toggle infinite scroll on and off.
      </p>
      <p>
        Because there are no well-established keyboard conventions for infinite scroll, the keyboard shortcuts
        should be provided to all keyboard users.
      </p>
      <p>This component does not support pagination because, from an ARIA perspective, pagination is a separate concept from infinite scroll and uses different patterns, ARIA attributes, and tags.</p>
    </PageSection>
  );
}
