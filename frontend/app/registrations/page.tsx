"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getMyRegistrations } from "@/services/registration.service";

import { Card, CardContent } from "@/components/ui/card";

interface Registration {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    description: string;
    venue: string;
    eventDate: string;
    fee: number;
    category: string;
  };
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await getMyRegistrations();
        setRegistrations(response.registrations || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">

          <h1 className="text-3xl font-bold">
            My Registrations
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : registrations.length === 0 ? (
            <p>You haven't registered for any events yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {registrations.map((registration) => (
                <Card key={registration.id}>
                  <CardContent className="space-y-3 p-5">

                    <h2 className="text-xl font-semibold">
                      {registration.event.title}
                    </h2>

                    <p className="text-gray-600">
                      {registration.event.description}
                    </p>

                    <p>
                      <strong>Venue:</strong>{" "}
                      {registration.event.venue}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        registration.event.eventDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Category:</strong>{" "}
                      {registration.event.category}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="font-semibold text-green-600">
                        {registration.status}
                      </span>
                    </p>

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