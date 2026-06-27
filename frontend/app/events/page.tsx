"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getAllEvents } from "@/services/event.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  eventDate: string;
  fee: number;
  category: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Events</h1>

          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="space-y-3 p-5">
                    <h2 className="text-xl font-semibold">
                      {event.title}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {event.description}
                    </p>

                    <p>
                      <strong>Venue:</strong> {event.venue}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Category:</strong> {event.category}
                    </p>

                    <p>
                      <strong>Fee:</strong> ₹{event.fee}
                    </p>

                    <Button className="w-full">
                      Register
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}