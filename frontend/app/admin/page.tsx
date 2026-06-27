"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createEvent } from "@/services/admin.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    eventDate: "",
    registrationDeadline: "",
    maxParticipants: 100,
    fee: 0,
    category: "TECHNICAL",
  });

  const handleSubmit = async () => {
    try {
      await createEvent(form);
      alert("Event Created Successfully");
    } catch (err: any) {
  console.log(err.response?.data);
  alert(JSON.stringify(err.response?.data, null, 2));
}
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl font-bold">
            Create Event
          </h1>

          <Input
            placeholder="Title"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <Input
            placeholder="Description"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Input
            placeholder="Venue"
            onChange={(e) =>
              setForm({ ...form, venue: e.target.value })
            }
          />

          <Input
            type="datetime-local"
            onChange={(e) =>
              setForm({ ...form, eventDate: e.target.value })
            }
          />

          <Input
            type="datetime-local"
            onChange={(e) =>
              setForm({
                ...form,
                registrationDeadline: e.target.value,
              })
            }
          />

          <Input
            type="number"
            placeholder="Maximum Participants"
            onChange={(e) =>
              setForm({
                ...form,
                maxParticipants: Number(e.target.value),
              })
            }
          />

          <Input
            type="number"
            placeholder="Fee"
            onChange={(e) =>
              setForm({
                ...form,
                fee: Number(e.target.value),
              })
            }
          />

          <Input
            placeholder="Category (TECHNICAL)"
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          />

          <Button
            className="w-full"
            onClick={handleSubmit}
          >
            Create Event
          </Button>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}