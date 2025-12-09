import React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

export default function KeyboardShortcuts({ isInDrawer = false }: { isInDrawer?: boolean }) {
  return (
    <>
      <div className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold pf-v6-u-mt-md pf-v6-u-mb-md">Keyboard shortcuts:</div>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Escape</DescriptionListTerm>
          <DescriptionListDescription>Exit list</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Page Down</DescriptionListTerm>
          <DescriptionListDescription>Move focus to next item</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Page Up</DescriptionListTerm>
          <DescriptionListDescription>Move focus to previous item</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Control + Home</DescriptionListTerm>
          <DescriptionListDescription>Move focus to first focusable element in the feed</DescriptionListDescription>
        </DescriptionListGroup>
        {!isInDrawer && (
        <DescriptionListGroup>
          <DescriptionListTerm>Control + End</DescriptionListTerm>
          <DescriptionListDescription>Move focus to first focusable element after the feed</DescriptionListDescription>
        </DescriptionListGroup>
        )}
      </DescriptionList>
    </>
  );
}
