import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";

import {
  CalendarDays,
  Ticket,
  Users,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, Tejas 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Here's what's happening in your college fest.
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

        {/* Upcoming Events Section */}
        <UpcomingEvents />
      </div>
    </DashboardLayout>
  );
}