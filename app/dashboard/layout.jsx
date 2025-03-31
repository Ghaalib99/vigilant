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
  UserPlus,
  UserCircle,
  Mail,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import Image from "next/image";
import defaultImg from "@/public/NpfLogo.png";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter } from "next/navigation";
import { useAuthProtection } from "../hooks/useAuthProtection";

function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    {
      icon: FileStack,
      label: "Incidents",
      href: "/dashboard/incidents",
    },
    { icon: BarChart2, label: "Reports", href: "/dashboard/reports" },
    { icon: UserPlus, label: "Setup", href: "/dashboard/setup" },
  ];

  const restrictedPages = {
    Setup: [
      "vgn-customer-service",
      "npf-investigator",
      "npf-prosecutor",
      "bank-fraud-desk",
      "bank-internal-control",
      "bank-internal-audit",
      "bank-risk",
    ],
    Incidents: ["super"],
    Reports: ["super"],
  };

  const filteredMenuItems = menuItems.filter(
    ({ label }) => !restrictedPages[label]?.includes(user?.role?.name)
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateToProfile = () => {
    router.push("/dashboard/profile");
  };

  useAuthProtection();

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
        {filteredMenuItems.map(({ icon: Icon, label, href }, index) => (
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
            {/* Notifications */}
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>

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

        {/* Profile Info Bar */}
        <div
          onClick={navigateToProfile}
          className="w-full bg-gray-50 border-b px-6 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserCircle className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium text-gray-700">
                {user?.first_name} {user?.last_name}
              </span>
            </div>
            <div className="hidden md:flex items-center">
              <Mail className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-center">
            <Badge className="bg-primary/10 text-primary border-0">
              {user?.role?.name
                ?.toLowerCase()
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </Badge>
            <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 pt-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
