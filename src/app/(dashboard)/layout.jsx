import React from "react";
import {
  Home,
  Settings,
  Users,
  BarChart2,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";

function DashboardLayout({ children }) {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Customer Service", href: "/customer-service" },
    { icon: BarChart2, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-16 text-white bg-ring border-r flex flex-col items-center py-4 space-y-4 pt-20">
        <TooltipProvider>
          {menuItems.map(({ icon: Icon, label, href }, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link href={href}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>

        {/* Bottom actions */}
        <div className="mt-auto space-y-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/logout">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white border-b h-16 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">VigilantNPF</h1>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>

            {/* User Avatar */}
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
