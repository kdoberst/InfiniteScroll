import { Button, Spinner } from '@patternfly/react-core';
import React, { MutableRefObject, RefObject } from 'react';

export type InfiniteScrollLoadMoreButtonProps = {
  /** Whether items are currently being loaded */
  isLoading: boolean;
  /** Title/label for the items */
  itemsTitle: string;
  /** Number of items per page */
  itemsPerPage?: number;
  /** Ref to the button element */
  loadMoreButtonRef: RefObject<HTMLButtonElement>;
  /** Current number of items (for tracking before load) */
  itemsCount: number;
  /** Ref tracking the item count before loading */
  previousPostCountRef: MutableRefObject<number>;
  /** Ref tracking if button had focus when clicked */
  loadMoreButtonHadFocusRef: MutableRefObject<boolean>;
  /** Callback when button is clicked */
  onLoadMore: () => void;
};

/**
 * Load more button component that appears when infinite scroll is disabled.
 * Handles focus tracking for accessibility when new content is loaded.
 */
export default function InfiniteScrollLoadMoreButton({
  isLoading,
  itemsTitle,
  itemsPerPage,
  loadMoreButtonRef,
  itemsCount,
  previousPostCountRef,
  loadMoreButtonHadFocusRef,
  onLoadMore,
}: InfiniteScrollLoadMoreButtonProps) {
  const handleClick = () => {
    // Store the current item count before loading (for focus management)
    previousPostCountRef.current = itemsCount;
    // Track if the button has focus (for focus management after loading)
    loadMoreButtonHadFocusRef.current = document.activeElement === loadMoreButtonRef.current;
    // Trigger loading the next page
    onLoadMore();
  };

  return (
    <p>
      <Button
        ref={loadMoreButtonRef}
        onClick={handleClick}
        isAriaDisabled={isLoading}
        icon={isLoading && <Spinner size="md" aria-hidden="true" />}
      >
        {isLoading ? (
          <>
            Loading more {itemsTitle}{' '}
            <span className="pf-v6-u-screen-reader">
              new content will receive focus once loaded
            </span>
          </>
        ) : (
          <>Load {itemsPerPage} more</>
        )}
      </Button>
    </p>
  );
}

