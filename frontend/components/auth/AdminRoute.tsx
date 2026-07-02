"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth.service";

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await getCurrentUser();

        if (response.user.role === "ADMIN") {
          setAuthorized(true);
        } else {
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}