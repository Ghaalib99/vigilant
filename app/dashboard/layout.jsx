"use client";
import React, { useState } from "react";
import {
  Home,
  Settings,
  Users,
  BarChart2,
  Bell,
  Search,
  LogOut,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import Image from "next/image";
import defaultImg from "@/public/NpfLogo.png"

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    {
      icon: Users,
      label: "Incidents",
      href: "/dashboard/incidents",
    },
    { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "dashboard/settings" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } text-white bg-primary border-r flex flex-col items-center py-4 space-y-4 pt-20 transition-all duration-300 ease-in-out`}
      >
        {/* Toggle Button */}
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Menu Items */}
        {menuItems.map(({ icon: Icon, label, href }, index) => (
          <Link
            key={index}
            href={href}
            className="w-full flex items-center space-x-4 px-4 py-2 hover:bg-gray-100 hover:text-primary rounded-md"
          >
            <Icon className="h-5 w-5" />
            {isSidebarOpen && <span className="text-sm">{label}</span>}
          </Link>
        ))}

        {/* Bottom actions */}
        <div className="mt-auto space-y-4 w-full px-4">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full flex justify-start items-center space-x-4 px-4 py-2 hover:bg-gray-100 rounded-md"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white border-b h-16 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">NPF Vigilant</h1>

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
              <AvatarFallback>
                <Image src={defaultImg} width={50} height={50} alt="User avatar" />
              </AvatarFallback>
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
