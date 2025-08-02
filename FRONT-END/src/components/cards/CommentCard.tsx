import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {comment.author.name}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{comment.content}</p>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
