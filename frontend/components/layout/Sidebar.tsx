"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  User,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";

import { getCurrentUser } from "@/services/auth.service";

export default function Sidebar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setRole(response.user.role);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Events",
      href: "/events",
      icon: CalendarDays,
    },
    {
      title: "My Registrations",
      href: "/registrations",
      icon: Ticket,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    ...(role === "ADMIN"
      ? [
          {
            title: "Admin",
            href: "/admin",
            icon: Shield,
          },
        ]
      : []),
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white p-5">
      <h1 className="mb-10 text-2xl font-bold text-blue-600">
        FestSphere
      </h1>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-slate-100"
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 rounded-lg px-4 py-3 text-red-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}