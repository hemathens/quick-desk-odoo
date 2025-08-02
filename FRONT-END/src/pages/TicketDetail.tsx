import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui/button";
import CommentCard from "@/components/cards/CommentCard";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await fetch(`http://localhost:5000/tickets/${id}`);
        const data = await response.json();
        if (response.ok) {
          setTicket(data.ticket);
          setComments(data.comments);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
    fetchTicket();
  }, [id, toast]);

  const onSubmit = async (commentData) => {
    try {
      const response = await fetch(`http://localhost:5000/tickets/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(commentData)
      });
      const data = await response.json();
      if (response.ok) {
        setComments([...comments, data]);
        reset();
        toast({ title: "Comment added successfully!" });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="ticket-detail">
      <Card>
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
          <Badge className={ticket.status === 'open' ? 'bg-green-500' : 'bg-red-500'}>
            {ticket.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <p>{ticket.description}</p>
        </CardContent>
      </Card>

      <h2>Comments</h2>
      {comments.map(comment => (
        <CommentCard key={comment._id} comment={comment} />
      ))}

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea {...register("content")} placeholder="Add a comment" required></textarea>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default TicketDetail;

