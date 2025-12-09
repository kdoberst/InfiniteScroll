import InfiniteScroll from '@app/InfiniteScroll/InfiniteScroll';
import React  from 'react';
import { fetchPosts } from './fetchPosts';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';

const POSTS_PER_PAGE = 10;

type PostType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const Post = ({ post }: { post: PostType, key: string | number }) => {
  return (
    <Card
    className="pf-v6-u-mb-xl"
    style={{ marginBottom: '1rem' }}
    key={post.id}
  >
    <CardTitle>
      {post.id} - {post.title}
    </CardTitle>
    <CardBody><a href={`#`}>More info for post {post.id}</a></CardBody>
  </Card>
  );
};


export default function PostsLists({ isInDrawer = false }: { isInDrawer?: boolean }) {
  const [posts, setPosts] = React.useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [endOfData, setEndOfData] = React.useState(false);

  const fetchMoreItems = React.useCallback(async (page: number) => {
    console.log('fetchMoreItems', page);
    setIsLoading(true);
    const newPosts = await fetchPosts(page, POSTS_PER_PAGE);
    setPosts((prevPosts) => [...prevPosts, ...newPosts.map((post) => <Post post={post} key={post.id} />)]);
    setEndOfData(newPosts.length === 0);
    setIsLoading(false);
  }, []);

  return (
    <InfiniteScroll
      items={posts}
      fetchMoreItems={fetchMoreItems}
      endOfData={endOfData}
      isLoading={isLoading}
      itemsPerPage={POSTS_PER_PAGE}
      isInDrawer={isInDrawer}
      ariaFeedLabel="Sample posts"
      feedTitle="Posts"

      // turnOffInfiniteScrollByDefault={true}
      // onlyAllowLoadMoreButton={true}
    />
  );
}