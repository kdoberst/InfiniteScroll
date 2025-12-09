import { Spinner } from '@patternfly/react-core';
import React from 'react';

export type InfiniteScrollLoadingIndicatorProps = {
  /** Whether items are currently being loaded */
  isLoading: boolean;
  /** Number of items currently loaded */
  itemsCount: number;
  /** Number of items per page (for display) */
  itemsPerPage?: number;
};

/**
 * Loading indicator component that displays a spinner when items are being loaded.
 */
export default function InfiniteScrollLoadingIndicator({
  isLoading,
  itemsCount,
  itemsPerPage,
}: InfiniteScrollLoadingIndicatorProps) {
  if (!isLoading) return null;

  return (
    <div role="status" aria-live="polite">
      <p>
        <Spinner size="md" aria-hidden="true" /> Loading {itemsCount !== 0 && ` ${itemsPerPage} more `}...
      </p>
    </div>
  );
}

