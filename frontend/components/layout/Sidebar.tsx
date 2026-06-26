"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  User,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";

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
  {
    title: "Admin",
    href: "/admin",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-white p-5">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">
        FestSphere
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-100 transition"
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-8">
        <button className="flex items-center gap-3 text-red-500 hover:text-red-600">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}