import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Clock,
  MoreVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    author: {
      name: string;
      role: string;
    };
    createdAt: string;
    upvotes: number;
    answers?: number;
    status: "open" | "resolved" | "in-progress";
    priority: string;
    isUpvoted?: boolean;
    isDownvoted?: boolean;
  };
  onVote?: (ticketId: string, type: "up" | "down") => void;
  showActions?: boolean;
}

export default function TicketCard({
  ticket,
  onVote,
  showActions = false,
}: TicketCardProps) {
  const [localUpvotes, setLocalUpvotes] = useState(ticket.upvotes);
  const [isUpvoted, setIsUpvoted] = useState(ticket.isUpvoted || false);
  const [isDownvoted, setIsDownvoted] = useState(ticket.isDownvoted || false);

  const handleVote = (type: "up" | "down") => {
    if (type === "up") {
      if (isUpvoted) {
        setLocalUpvotes((prev) => prev - 1);
        setIsUpvoted(false);
      } else {
        setLocalUpvotes((prev) => prev + (isDownvoted ? 2 : 1));
        setIsUpvoted(true);
        setIsDownvoted(false);
      }
    } else {
      if (isDownvoted) {
        setLocalUpvotes((prev) => prev + 1);
        setIsDownvoted(false);
      } else {
        setLocalUpvotes((prev) => prev - (isUpvoted ? 2 : 1));
        setIsDownvoted(true);
        setIsUpvoted(false);
      }
    }

    onVote?.(ticket.id, type);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="card-elegant p-6 hover-lift">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <Badge className={`text-xs ${getStatusBadge(ticket.status)}`}>
            {ticket.status}
          </Badge>
          <Badge className={`text-xs ${getPriorityBadge(ticket.priority)}`}>
            {ticket.priority} Priority
          </Badge>
          {ticket.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {ticket.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{ticket.tags.length - 2}
            </Badge>
          )}
        </div>

        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Ticket Content */}
      <Link to={`/tickets/${ticket.id}`} className="block group">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {ticket.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {ticket.description}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {ticket.author.name}
            </span>
            <Badge className="text-xs bg-gray-100 text-gray-600">
              {ticket.author.role}
            </Badge>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{formatTimeAgo(ticket.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Voting */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                isUpvoted
                  ? "text-primary bg-primary-light"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleVote("up");
              }}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[20px] text-center">
              {localUpvotes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                isDownvoted
                  ? "text-destructive bg-red-50"
                  : "text-muted-foreground hover:text-destructive"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleVote("down");
              }}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Comments/Updates */}
          {ticket.answers && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{ticket.answers}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

