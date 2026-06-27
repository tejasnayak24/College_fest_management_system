"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getCurrentUser } from "@/services/auth.service";

import {
  CalendarDays,
  Ticket,
  Users,
  Clock,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {loading ? "Loading..." : user?.name || "User"} 👋
            </h1>

            <p className="mt-2 text-gray-500">
              Welcome to your FestSphere dashboard.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Events"
              value={18}
              icon={CalendarDays}
            />

            <StatCard
              title="Registrations"
              value={42}
              icon={Ticket}
            />

            <StatCard
              title="Participants"
              value={260}
              icon={Users}
            />

            <StatCard
              title="Upcoming"
              value={6}
              icon={Clock}
            />
          </div>

          <UpcomingEvents />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}