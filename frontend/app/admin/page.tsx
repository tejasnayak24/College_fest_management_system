"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  createEvent,
  getAllEvents,
  deleteEvent,
} from "@/services/admin.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);

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

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async () => {
    try {
      await createEvent(form);

      alert("Event Created Successfully");

      setForm({
        title: "",
        description: "",
        venue: "",
        eventDate: "",
        registrationDeadline: "",
        maxParticipants: 100,
        fee: 0,
        category: "TECHNICAL",
      });

      await fetchEvents();
    } catch (err: any) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Failed to create event");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await deleteEvent(id);
      await fetchEvents();
      alert("Event deleted successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-10">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl font-bold">Create Event</h1>

            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <Input
              placeholder="Venue"
              value={form.venue}
              onChange={(e) =>
                setForm({
                  ...form,
                  venue: e.target.value,
                })
              }
            />

            <Input
              type="datetime-local"
              value={form.eventDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  eventDate: e.target.value,
                })
              }
            />

            <Input
              type="datetime-local"
              value={form.registrationDeadline}
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
              value={form.maxParticipants}
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
              value={form.fee}
              onChange={(e) =>
                setForm({
                  ...form,
                  fee: Number(e.target.value),
                })
              }
            />

            <Input
              placeholder="Category (TECHNICAL)"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value.toUpperCase(),
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

          <div>
            <h2 className="mb-4 text-2xl font-bold">
              Existing Events
            </h2>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Venue</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Fee</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-gray-500"
                      >
                        No events found.
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr
                        key={event.id}
                        className="border-t"
                      >
                        <td className="p-4">{event.title}</td>

                        <td className="p-4">{event.venue}</td>

                        <td className="p-4">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </td>

                        <td className="p-4">{event.category}</td>

                        <td className="p-4">
                          ₹{event.fee}
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() =>
                                alert("Edit feature coming next!")
                              }
                            >
                              <Pencil className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(event.id)
                              }
                            >
                              <Trash2 className="h-5 w-5 cursor-pointer text-red-600 hover:text-red-800" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}