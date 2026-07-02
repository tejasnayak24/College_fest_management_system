"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Settings</h1>

          <div className="rounded-lg border bg-white p-6">
            <p className="text-gray-600">
              ⚙️ Settings page coming soon.
            </p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}