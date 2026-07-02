"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getCurrentUser } from "@/services/auth.service";

import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          {!user ? (
            <p>Loading...</p>
          ) : (
            <Card className="max-w-2xl">
              <CardContent className="space-y-5 p-6">

                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <h2 className="text-xl font-semibold">
                    {user.name}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <h2 className="text-lg">
                    {user.email}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Role
                  </p>

                  <h2 className="text-lg">
                    {user.role}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Joined
                  </p>

                  <h2 className="text-lg">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </h2>
                </div>

              </CardContent>
            </Card>
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}