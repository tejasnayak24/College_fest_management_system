"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  createEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} from "@/services/admin.service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Pencil, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setEditingId(null);

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
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateEvent(editingId, form);
        alert("Event Updated Successfully");
      } else {
        await createEvent(form);
        alert("Event Created Successfully");
      }

      resetForm();
      await fetchEvents();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event?"
      )
    ) {
      return;
    }

    try {
      await deleteEvent(id);

      await fetchEvents();

      alert("Event deleted successfully");
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);

    setForm({
      title: event.title,
      description: event.description,
      venue: event.venue,
      eventDate: event.eventDate.slice(0, 16),
      registrationDeadline:
        event.registrationDeadline.slice(0, 16),
      maxParticipants: event.maxParticipants,
      fee: event.fee,
      category: event.category,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

 return (
  <ProtectedRoute>
    <DashboardLayout>
      <div className="space-y-10">

        <div className="max-w-2xl rounded-xl border bg-white p-6 shadow-sm">

          <h1 className="mb-6 text-3xl font-bold">
            {editingId ? "Edit Event" : "Create Event"}
          </h1>

          <div className="space-y-4">

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
                  registrationDeadline:
                    e.target.value,
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
                  maxParticipants: Number(
                    e.target.value
                  ),
                })
              }
            />

            <Input
              type="number"
              placeholder="Registration Fee"
              value={form.fee}
              onChange={(e) =>
                setForm({
                  ...form,
                  fee: Number(e.target.value),
                })
              }
            />

            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value.toUpperCase(),
                })
              }
            />

            <div className="flex gap-3">

              <Button
                className="flex-1"
                onClick={handleSubmit}
              >
                {editingId
                  ? "Update Event"
                  : "Create Event"}
              </Button>

              {editingId && (
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}

            </div>

          </div>

        </div>

        <div>

          <h2 className="mb-5 text-2xl font-bold">
            Existing Events
          </h2>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
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
            className="p-8 text-center text-gray-500"
          >
            No events available.
          </td>
        </tr>
      ) : (
        events.map((event) => (
          <tr
            key={event.id}
            className="border-t hover:bg-gray-50"
          >
            <td className="p-4 font-medium">
              {event.title}
            </td>

            <td className="p-4">
              {event.venue}
            </td>

            <td className="p-4">
              {new Date(
                event.eventDate
              ).toLocaleDateString()}
            </td>

            <td className="p-4">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {event.category}
              </span>
            </td>

            <td className="p-4">
              ₹{event.fee}
            </td>

            <td className="p-4">
              <div className="flex justify-center gap-4">

                <button
                  onClick={() => handleEdit(event)}
                  className="rounded p-2 hover:bg-blue-100"
                >
                  <Pencil className="h-5 w-5 text-blue-600" />
                </button>

                <button
                  onClick={() =>
                    handleDelete(event.id)
                  }
                  className="rounded p-2 hover:bg-red-100"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
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