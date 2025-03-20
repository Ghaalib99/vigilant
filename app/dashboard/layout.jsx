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
  PackagePlus,
  UserCheck,
  FileStack,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import Image from "next/image";
import defaultImg from "@/public/NpfLogo.png";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    {
      icon: FileStack,
      label: "Incidents",
      href: "/dashboard/incidents",
    },
    { icon: BarChart2, label: "Reports", href: "/dashboard/reports" },
    // { icon: Settings, label: "Settings", href: "dashboard/settings" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUserInfo = () => {
    setIsUserInfoOpen(!isUserInfoOpen);
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
            className={`w-full flex items-center space-x-4 px-4 py-2 rounded-md ${
              pathname === href
                ? "bg-gray-300 text-primary"
                : "hover:bg-gray-100 hover:text-primary"
            }`}
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
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            {/* Role Badge */}
            <div className="relative">
              <Badge
                // variant="outline"
                className="cursor-pointer h-8 hover:bg-gray-100 hover:text-primary flex items-center gap-1 rounded-md"
                onClick={toggleUserInfo}
              >
                <UserCheck size={20} className="h-3 w-3" />
                <span>
                  {user?.role?.name
                    ?.toLowerCase()
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </span>
              </Badge>

              {/* User Info Popover */}
              {isUserInfoOpen && (
                <div className="absolute right-0 mt-2 z-50 min-w-[250px] w-[300px] bg-white text-primary border rounded-md shadow-lg p-4">
                  <div className="space-y-2">
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold py-2 border-b">
                        <span className="font-medium inline-block w-[50px] mr-4">
                          Name:
                        </span>{" "}
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="font-semibold py-2 border-b">
                        <span className="font-medium inline-block w-[50px] mr-4">
                          Email:
                        </span>{" "}
                        {user?.email}
                      </p>
                      <p className="font-semibold py-2 border-b">
                        <span className="font-medium inline-block w-[50px] mr-4">
                          Phone:
                        </span>{" "}
                        {user?.phone}
                      </p>
                      <p className="font-semibold py-2 border-b">
                        <span className="font-medium inline-block w-[50px] mr-4">
                          Role:
                        </span>{" "}
                        {user?.role?.name
                          ?.toLowerCase()
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </p>
                      {user?.entity && (
                        <p className="font-semibold py-2 border-b">
                          <span className="font-medium inline-block w-[50px] mr-4">
                            Entity:
                          </span>{" "}
                          {user?.entity?.name}
                        </p>
                      )}
                      {user?.bank && (
                        <p className="font-semibold py-2 border-b">
                          <span className="font-medium inline-block w-[50px] mr-4">
                            Bank:
                          </span>{" "}
                          {user?.bank?.bank_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>

            {/* User Avatar */}
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
              <AvatarFallback>
                <Image
                  src={defaultImg}
                  width={50}
                  height={50}
                  alt="User avatar"
                />
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
