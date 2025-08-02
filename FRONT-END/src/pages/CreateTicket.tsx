import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "react-quill/dist/quill.snow.css"; // Import styles
import ReactQuill from "react-quill";

function CreateTicket() {
  const { register, handleSubmit, setValue } = useForm();
  const [description, setDescription] = useState("");
  const history = useHistory();

  const onSubmit = async (data) => {
    await fetch('/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, description })
    });
    history.push('/dashboard');
  };

  return (
    <div className="create-ticket">
      <h1>Create a Ticket</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title")} placeholder="Title" />
        <ReactQuill value={description} onChange={setDescription} />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default CreateTicket;
