"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="relative w-80">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search events..."
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer text-gray-600" size={22} />

        <Avatar>
          <AvatarFallback>TN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}