import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Spinner,
  Switch,
} from '@patternfly/react-core';
import { fetchPosts } from './fetchPosts';

import './infiniteScroll.css';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Constants
const POSTS_PER_PAGE = 5;
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// Helper functions
const getAllFocusableElements = (): HTMLElement[] => {
  return Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
};

const isElementVisible = (el: HTMLElement): boolean => {
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  if (el.getAttribute('aria-hidden') === 'true') {
    return false;
  }
  return true;
};

const findCurrentArticleIndex = (
  activeElement: Element | null,
  articles: HTMLElement[],
): number => {
  if (!(activeElement instanceof HTMLElement)) return -1;
  
  if (activeElement.tagName === 'ARTICLE' && articles.includes(activeElement)) {
    return articles.indexOf(activeElement);
  }
  
  return articles.findIndex((article) => article.contains(activeElement));
};

const PostsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const observer = useRef<IntersectionObserver>();
  const sectionRef = useRef<HTMLDivElement>(null);
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const hasInitialBulkLoadRef = useRef(false);
  const isBulkLoadingRef = useRef(false);
  const targetPageForScrollRef = useRef<number | null>(null);
  const previousPostCountRef = useRef(0);
  const loadMoreButtonHadFocusRef = useRef(false);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  const increasePage = useCallback(() => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      // Update URL query parameter
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set('page', newPage.toString());
        return newParams;
      });
      return newPage;
    });
  }, [setSearchParams]);

  const loadPage = useCallback(async (pageToLoad: number) => {
    // Prevent duplicate calls for the same page
    if (loadedPagesRef.current.has(pageToLoad)) {
      return [];
    }

    try {
      const newPosts = await fetchPosts(pageToLoad, POSTS_PER_PAGE);
      if (newPosts.length === 0) {
        setHasMore(false);
        setStatusMessage('All posts loaded. End of feed.');
        return [];
      } else {
        loadedPagesRef.current.add(pageToLoad);
        return newPosts;
      }
    } catch {
      setHasMore(false);
      setStatusMessage('Error loading posts. Please try again later.');
      return [];
    }
  }, []);

  const loadMorePosts = useCallback(async () => {
    // Prevent duplicate calls for the same page
    if (isLoadingRef.current || loadedPagesRef.current.has(page)) {
      return;
    }

    // Store the current post count before loading
    previousPostCountRef.current = posts.length;

    // Check if the "Load more" button currently has focus
    loadMoreButtonHadFocusRef.current = document.activeElement === loadMoreButtonRef.current;

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const newPosts = await loadPage(page);
      if (newPosts.length > 0) {
        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts, ...newPosts];
          setStatusMessage(
            `${newPosts.length} new post${newPosts.length === 1 ? '' : 's'} loaded. Total: ${updatedPosts.length} post${updatedPosts.length === 1 ? '' : 's'}.`,
          );
          return updatedPosts;
        });
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [page, loadPage, posts.length]);

  // Initial bulk load: if page is in URL, load all pages from 1 to that page
  useEffect(() => {
    if (hasInitialBulkLoadRef.current) return;

    hasInitialBulkLoadRef.current = true;
    const pageParam = searchParams.get('page');

    if (pageParam) {
      const targetPage = parseInt(pageParam, 10);
      if (!isNaN(targetPage) && targetPage >= 1) {
        setLoading(true);

        // Load all pages from 1 to targetPage sequentially
        const loadAllPages = async () => {
          isBulkLoadingRef.current = true;
          const allPosts: Post[] = [];
          try {
            for (let p = 1; p <= targetPage; p++) {
              const posts = await loadPage(p);
              if (posts && posts.length > 0) {
                allPosts.push(...posts);
              } else {
                setHasMore(false);
                break;
              }
            }
            // Set all posts at once after loading all pages
            setPosts(allPosts);
            setStatusMessage(`${allPosts.length} post${allPosts.length === 1 ? '' : 's'} loaded.`);
            // Store target page for scrolling after render
            if (targetPage > 1) {
              targetPageForScrollRef.current = targetPage;
            }
          } finally {
            setLoading(false);
            isBulkLoadingRef.current = false;
          }
        };

        loadAllPages();
        return;
      }
    }

    // If no page param, load page 1 normally
    if (!loadedPagesRef.current.has(1)) {
      isLoadingRef.current = true;
      setLoading(true);
      loadPage(1).then((posts) => {
        if (posts.length > 0) {
          setPosts(posts);
        }
        setLoading(false);
        isLoadingRef.current = false;
      });
    }
  }, [searchParams, loadPage]);

  // Sync page state with URL query parameter (only after initial load)
  // Skip this during initial bulk load to prevent interference
  useEffect(() => {
    if (!hasInitialBulkLoadRef.current) return;

    const pageParam = searchParams.get('page');
    if (pageParam) {
      const urlPage = parseInt(pageParam, 10);
      if (!isNaN(urlPage) && urlPage !== page) {
        setPage(urlPage);
      }
    }
  }, [searchParams, page]);

  // Load posts when page changes (only after initial bulk load)
  // This should NOT run during initial bulk load
  useEffect(() => {
    // Don't run during bulk loading or before initial load is complete
    if (!hasInitialBulkLoadRef.current || !hasMore || isBulkLoadingRef.current) return;

    // Only load if this page hasn't been loaded yet
    if (!loadedPagesRef.current.has(page)) {
      loadMorePosts();
    }
  }, [page, hasMore, loadMorePosts]);

  // Scroll to target page after initial bulk load and posts are rendered
  useEffect(() => {
    if (targetPageForScrollRef.current && posts.length > 0 && !loading && !isBulkLoadingRef.current) {
      const targetPage = targetPageForScrollRef.current;
      // Calculate the index of the first post of the target page
      const targetPostIndex = (targetPage - 1) * POSTS_PER_PAGE;

      if (targetPostIndex < posts.length) {
        // Use setTimeout to ensure DOM is updated and rendered
        setTimeout(() => {
          // Find the card element for the target post
          const cardElements = document.querySelectorAll('[data-post-index]');
          const targetCard = cardElements[targetPostIndex] as HTMLElement;

          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Clear the ref so we don't scroll again
            targetPageForScrollRef.current = null;
          }
        }, 100);
      } else {
        // If target index is out of bounds, clear the ref
        targetPageForScrollRef.current = null;
      }
    }
  }, [posts.length, loading]);

  // Focus management: Move focus to first newly loaded post when infinite scroll is disabled
  // Only if the "Load more" button had focus when loading started and still has focus
  useEffect(() => {
    if (
      !isInfiniteScrollEnabled &&
      !loading &&
      posts.length > previousPostCountRef.current &&
      loadMoreButtonHadFocusRef.current
    ) {
      const firstNewPostIndex = previousPostCountRef.current;
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        // Only move focus if the button still has focus (user hasn't moved elsewhere)
        if (document.activeElement === loadMoreButtonRef.current) {
          const articleElements = document.querySelectorAll('article[data-post-index]');
          const firstNewArticle = articleElements[firstNewPostIndex] as HTMLElement;

          if (firstNewArticle) {
            // Find the first focusable element within the article (CardTitle or link)
            const focusableElement = firstNewArticle.querySelector(
              'a, button, [tabindex]:not([tabindex="-1"])',
            ) as HTMLElement;
            if (focusableElement) {
              focusableElement.focus();
            } else {
              // If no focusable element, make the article focusable and focus it
              firstNewArticle.setAttribute('tabindex', '-1');
              firstNewArticle.focus();
            }
          }
        }
        // Reset the flag after attempting to move focus
        loadMoreButtonHadFocusRef.current = false;
      }, 100);
    }
  }, [loading, isInfiniteScrollEnabled, posts.length]);

  // Handle focus/blur for older browsers and touch devices
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleFocusIn = () => setIsSectionVisible(true);
    const handleFocusOut = (e: FocusEvent) => {
      // Only hide if focus is moving outside the section
      if (!section.contains(e.relatedTarget as Node)) {
        setIsSectionVisible(false);
      }
    };

    section.addEventListener('focusin', handleFocusIn);
    section.addEventListener('focusout', handleFocusOut);

    return () => {
      section.removeEventListener('focusin', handleFocusIn);
      section.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Handle keyboard navigation in feed
  useEffect(() => {
    const postsContainer = postsContainerRef.current;
    const feed = feedRef.current;
    if (!postsContainer || !feed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if focus is currently within the feed
      const activeElement = document.activeElement;
      if (!activeElement || !feed.contains(activeElement)) return;

      const allFocusableElements = getAllFocusableElements();

      // Handle Escape key to move focus out of posts list
      if (e.key === 'Escape') {
        // Find the index of the currently focused element
        const currentIndex = allFocusableElements.indexOf(activeElement as HTMLElement);

        // Find the next focusable element that's NOT in the posts container
        for (let i = currentIndex + 1; i < allFocusableElements.length; i++) {
          const nextEl = allFocusableElements[i];
          if (!postsContainer.contains(nextEl)) {
            e.preventDefault();
            nextEl.focus();
            return;
          }
        }

        // If no element found after, try finding by position (below the container)
        const postsContainerRect = postsContainer.getBoundingClientRect();
        const nextFocusable = allFocusableElements.find((el) => {
          if (postsContainer.contains(el)) return false;
          const elRect = el.getBoundingClientRect();
          // Element is after the posts container (below it)
          return elRect.top > postsContainerRect.bottom;
        });

        if (nextFocusable) {
          e.preventDefault();
          nextFocusable.focus();
        }
        return;
      }

      // Handle Page Down: Move focus to next article
      if (e.key === 'PageDown') {
        e.preventDefault();
        const articles = Array.from(feed.querySelectorAll<HTMLElement>('article[tabindex="0"]'));
        const currentArticleIndex = findCurrentArticleIndex(activeElement, articles);

        if (currentArticleIndex >= 0 && currentArticleIndex < articles.length - 1) {
          articles[currentArticleIndex + 1].focus();
        } else if (currentArticleIndex === -1 && articles.length > 0) {
          articles[0].focus();
        }
        return;
      }

      // Handle Page Up: Move focus to previous article
      if (e.key === 'PageUp') {
        e.preventDefault();
        const articles = Array.from(feed.querySelectorAll<HTMLElement>('article[tabindex="0"]'));
        const currentArticleIndex = findCurrentArticleIndex(activeElement, articles);

        if (currentArticleIndex > 0) {
          articles[currentArticleIndex - 1].focus();
        } else if (currentArticleIndex === -1 && articles.length > 0) {
          articles[0].focus();
        }
        return;
      }

      // Handle Control + Home: Move focus to first focusable element in the feed (first article)
      if ((e.key === 'Home' || e.code === 'Home') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();

        // Find all articles in the feed
        const articles = Array.from(feed.querySelectorAll<HTMLElement>('article[tabindex="0"]'));

        if (articles.length > 0) {
          // Focus the first article
          articles[0].focus();
        }
        return;
      }

      // Handle Control + End: Move focus to first focusable element after the feed
      if ((e.key === 'End' || e.code === 'End') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();

        const visibleFocusableElements = allFocusableElements.filter(
          (el) => !feed.contains(el) && isElementVisible(el),
        );

        // Find first element after feed in document order
        for (const el of visibleFocusableElements) {
          if (feed.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
            el.focus();
            return;
          }
        }
        return;
      }
    };

    // Add listener to feed for keyboard navigation
    feed.addEventListener('keydown', handleKeyDown);

    // Also add a document-level listener with capture for Control+Home/End
    // to catch them before browser default behavior
    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      // Only handle Control+Home and Control+End
      if (
        !((e.key === 'Home' || e.code === 'Home' || e.key === 'End' || e.code === 'End') && (e.ctrlKey || e.metaKey))
      ) {
        return;
      }

      // Check if focus is currently within the feed
      const activeElement = document.activeElement;
      if (!activeElement || !feed.contains(activeElement)) {
        return;
      }

      // Call the main handler for these specific keys
      handleKeyDown(e);
    };

    document.addEventListener('keydown', handleDocumentKeyDown, true); // Use capture phase

    return () => {
      feed.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleDocumentKeyDown, true);
    };
  }, []);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || !hasMore || !isInfiniteScrollEnabled) return; // Stop observing if loading or no more posts
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          increasePage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isInfiniteScrollEnabled, increasePage],
  );

  return (
    <div ref={postsContainerRef}>
      <div>
        <Card
          id="infinite-scroll-switcher"
          ref={sectionRef}
          tabIndex={0}
          className={`${isSectionVisible ? 'visible' : ''} pf-v6-u-mb-xl`}
          aria-describedby="infinite-scroll-switcher-title"
        >
          <CardTitle id="infinite-scroll-switcher-title">Automatic loading of new items settings: </CardTitle>
          <CardBody>
            <Switch
              label="Enable automatic loading of new items"
              id="checked-with-label-switch-on"
              isChecked={isInfiniteScrollEnabled}
              hasCheckIcon
              onChange={() => setIsInfiniteScrollEnabled(!isInfiniteScrollEnabled)}
            />
          
            <p className="keyboard-shortcuts-title ">Other keyboard shortcuts:</p>
            <DescriptionList isHorizontal>
              <DescriptionListGroup>
                <DescriptionListTerm>Escape</DescriptionListTerm>
                <DescriptionListDescription>Exit item list</DescriptionListDescription>
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
                <DescriptionListDescription>
                  Move focus to first focusable element in the feed
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Control + End</DescriptionListTerm>
                <DescriptionListDescription>
                  Move focus to first focusable element after the feed
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>

        <div role="status" className="pf-v6-u-screen-reader">
          {statusMessage}
        </div>
      </div>

      <div
        ref={feedRef}
        role="feed"
        aria-busy={loading}
        aria-label={`Posts feed${posts.length > 0 ? `, ${posts.length} post${posts.length === 1 ? '' : 's'} loaded` : ''}${!hasMore ? ', all posts loaded' : ''}`}
      >
        {posts.map((post, index) => (
          <article key={`${post.id}`} aria-posinset={index + 1} aria-setsize={hasMore ? -1 : posts.length} tabIndex={0}>
            <Card
              className="pf-v6-u-mb-xl"
              style={{ marginBottom: '1rem' }}
              ref={posts.length === index + 1 ? lastPostElementRef : null}
            >
              <CardTitle>
                {post.id} - {post.title}
              </CardTitle>
            </Card>
          </article>
        ))}
      </div>

      {!hasMore && (
        <>
          <p>All items loaded.</p>
        </>
      )}

      {loading && isInfiniteScrollEnabled && (
        <div role="status" aria-live="polite">
          <p>
            <Spinner size="md" aria-hidden="true" /> Loading {posts.length !== 0 && ` ${POSTS_PER_PAGE} more `}...
          </p>
        </div>
      )}
      {!isInfiniteScrollEnabled && hasMore && (
        <p>
          <Button
            ref={loadMoreButtonRef}
            onClick={() => {
              increasePage();
            }}
            isAriaDisabled={loading}
            icon={loading && <Spinner size="md" aria-hidden="true" />}
          >
            {loading ? (
              <>
                Loading more items{' '}
                <span className="pf-v6-u-screen-reader"> you will be brought to the new content once loaded</span>
              </>
            ) : (
              <>Load {POSTS_PER_PAGE} more</>
            )}
          </Button>
        </p>
      )}
    </div>
  );
};
export default PostsList;
