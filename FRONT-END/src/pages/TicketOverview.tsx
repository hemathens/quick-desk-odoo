import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CommentCard from "@/components/cards/CommentCard";
import { useForm } from "react-hook-form";

function TicketOverview() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    async function fetchTicket() {
      const response = await fetch(`http://localhost:5000/tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTicket(data.ticket);
      setComments(data.comments);
    }
    fetchTicket();
  }, [id]);

  const onSubmit = async (data) => {
    await fetch(`http://localhost:5000/tickets/${id}/comments`, { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    reset();
    fetchTicket();
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="ticket-overview">
      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>

      <h2>Comments</h2>
      {comments.map(comment => (
        <CommentCard key={comment._id} comment={comment} />
      ))}

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea {...register("content")} placeholder="Add a comment"></textarea>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default TicketOverview;
