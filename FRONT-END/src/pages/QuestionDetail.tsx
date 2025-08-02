import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Calendar,
  Tag,
  User,
  Award,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockQuestion = {
  id: '1',
  title: 'How to implement user authentication in React?',
  content: `I'm building a React application and need to implement user authentication. 
  
  I want to handle login, logout, and protect certain routes. What are the best practices for this?
  
  I've heard about JWT tokens, but I'm not sure how to implement them securely on the frontend.
  
  Any guidance would be appreciated!`,
  author: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    reputation: 1240
  },
  category: 'React',
  tags: ['react', 'authentication', 'jwt', 'security'],
  votes: 15,
  answers: 3,
  views: 234,
  createdAt: '2024-01-15T10:30:00Z',
  status: 'open'
};

const mockAnswers = [
  {
    id: '1',
    content: `Great question! Here's a comprehensive approach to implementing authentication in React:

## 1. Choose an Authentication Strategy

For JWT-based authentication, you'll want to:
- Store JWT tokens securely (avoid localStorage for sensitive data)
- Implement token refresh mechanisms
- Handle token expiration gracefully

## 2. Implementation Steps

\`\`\`jsx
// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Implementation details...
};
\`\`\`

## 3. Protected Routes

Use a ProtectedRoute component to wrap authenticated routes.

This approach ensures secure and maintainable authentication!`,
    author: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      reputation: 3200
    },
    votes: 12,
    isAccepted: true,
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '2',
    content: `I'd also recommend looking into established libraries like:

- **Auth0**: Enterprise-grade authentication service
- **Firebase Auth**: Google's authentication solution
- **NextAuth.js**: If you're using Next.js
- **Supabase Auth**: Open-source alternative with great DX

These solutions handle the complexity of secure authentication for you, including:
- Password hashing
- Token management
- Social login providers
- MFA support

Unless you have specific requirements, using a proven authentication service is usually the better choice than rolling your own.`,
    author: {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      reputation: 8900
    },
    votes: 8,
    isAccepted: false,
    createdAt: '2024-01-15T16:45:00Z'
  }
];

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(mockQuestion);
  const [answers, setAnswers] = useState(mockAnswers);
  const [newAnswer, setNewAnswer] = useState('');
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const { toast } = useToast();

  const handleVote = (type: 'question' | 'answer', itemId: string, voteType: 'up' | 'down') => {
    const currentVote = userVotes[itemId];
    let newVote: 'up' | 'down' | null = voteType;
    
    // If clicking the same vote type, remove the vote
    if (currentVote === voteType) {
      newVote = null;
    }
    
    setUserVotes(prev => ({
      ...prev,
      [itemId]: newVote
    }));

    if (type === 'question') {
      setQuestion(prev => ({
        ...prev,
        votes: prev.votes + (newVote === 'up' ? 1 : newVote === 'down' ? -1 : 0)
      }));
    } else {
      setAnswers(prev => prev.map(answer => 
        answer.id === itemId 
          ? { ...answer, votes: answer.votes + (newVote === 'up' ? 1 : newVote === 'down' ? -1 : 0) }
          : answer
      ));
    }

    toast({
      title: "Vote recorded",
      description: `Your ${voteType}vote has been recorded.`,
    });
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;

    const answer = {
      id: Date.now().toString(),
      content: newAnswer,
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'current@example.com',
        reputation: 500
      },
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString()
    };

    setAnswers(prev => [...prev, answer]);
    setNewAnswer('');

    toast({
      title: "Answer submitted",
      description: "Your answer has been posted successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Questions
            </Button>
          </Link>
        </div>

        {/* Question Card */}
        <Card className="card-elegant mb-8 animate-fade-in">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-3">{question.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Asked {formatDate(question.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {question.answers} answers
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {question.views} views
                  </div>
                </div>
              </div>
              
              {/* Vote Controls */}
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('question', question.id, 'up')}
                  className={`p-2 ${userVotes[question.id] === 'up' ? 'text-primary bg-primary/10' : ''}`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </Button>
                <span className="font-semibold text-lg">{question.votes}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('question', question.id, 'down')}
                  className={`p-2 ${userVotes[question.id] === 'down' ? 'text-destructive bg-destructive/10' : ''}`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Question Content */}
            <div className="prose prose-sm max-w-none mb-6">
              <p className="whitespace-pre-wrap">{question.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary-light text-primary">
                    {question.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{question.author.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Award className="w-3 h-3 mr-1" />
                    {question.author.reputation} reputation
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{question.category}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>

          {answers.map((answer, index) => (
            <Card 
              key={answer.id} 
              className={`card-elegant animate-fade-in ${answer.isAccepted ? 'border-success bg-success/5' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex gap-6">
                  {/* Vote Controls */}
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('answer', answer.id, 'up')}
                      className={`p-2 ${userVotes[answer.id] === 'up' ? 'text-primary bg-primary/10' : ''}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{answer.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('answer', answer.id, 'down')}
                      className={`p-2 ${userVotes[answer.id] === 'down' ? 'text-destructive bg-destructive/10' : ''}`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                    {answer.isAccepted && (
                      <Badge className="bg-success text-success-foreground mt-2">
                        Accepted
                      </Badge>
                    )}
                  </div>

                  {/* Answer Content */}
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none mb-4">
                      <div className="whitespace-pre-wrap">{answer.content}</div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary-light text-primary text-sm">
                            {answer.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{answer.author.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Award className="w-3 h-3 mr-1" />
                            {answer.author.reputation} reputation
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(answer.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Answer */}
        <Card className="card-elegant mt-8">
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
            <CardDescription>
              Share your knowledge and help others solve this problem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Write your answer here... You can use markdown formatting."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Post Answer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}