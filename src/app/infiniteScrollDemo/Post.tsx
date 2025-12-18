import React from 'react';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';



export type PostType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const Post = ({ post }: { post: PostType, key: string | number }) => {
  return (
    <Card
    className="pf-v6-u-mb-xl"
    style={{ marginBottom: '1rem' }}
    key={post.id}
  >
    <CardTitle>
      <h3>{post.id} - {post.title}</h3>
    </CardTitle>
    <CardBody><a href={`#`}>More info for post {post.id}</a></CardBody>
  </Card>
  );
};
