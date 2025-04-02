"use client";
import React, { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Bell,
  MailOpen,
  Inbox,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  ChevronLeft,
  X,
} from "lucide-react";
import {
  fetchAllNotifications,
  fetchNotificationDetails,
  fetchReadNotifications,
  fetchUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/app/services/notificationService";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function Notifications() {
  const authToken = useSelector((state) => state.auth.token);
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotificationsData();
  }, [authToken, filterCriteria]);

  const fetchNotificationsData = async () => {
    try {
      setLoading(true);
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      let response;
      switch (filterCriteria) {
        case "read":
          response = await fetchReadNotifications(authToken);
          break;
        case "unread":
          response = await fetchUnreadNotifications(authToken);
          break;
        default:
          response = await fetchAllNotifications(authToken);
          break;
      }

      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  };

  const handleViewDetails = async (notificationId) => {
    try {
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      const response = await fetchNotificationDetails(
        authToken,
        notificationId
      );
      setSelectedNotification(response.data);

      // If the notification is unread, mark it as read
      const notification = notifications.find((n) => n.id === notificationId);
      if (notification && !notification.read) {
        handleMarkAsRead(notificationId);
      }
    } catch (err) {
      console.error("Failed to fetch notification details", err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      await markNotificationAsRead(authToken, notificationId);

      // Update local state to mark notification as read
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      await markAllNotificationsAsRead(authToken);

      // Update local state to mark all notifications as read
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilterCriteria(tab);
    setSelectedNotification(null);
  };

  const getNotificationTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "alert":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <MessageSquare className="h-6 w-6 text-purple-500" />;
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "alert":
        return "border-l-4 border-l-red-500 bg-red-50";
      case "info":
        return "border-l-4 border-l-blue-500 bg-blue-50";
      case "success":
        return "border-l-4 border-l-green-500 bg-green-50";
      case "warning":
        return "border-l-4 border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-4 border-l-purple-500 bg-purple-50";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertOctagon className="mr-2" /> Notifications Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-4 text-red-600 border-red-300 hover:bg-red-100"
            onClick={() => fetchNotificationsData()}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full ">
      <div className="flex  items-center mb-4 w-full">
        <ChevronLeft
          onClick={() => router.back()}
          size={25}
          className="cursor-pointer mr-4"
        />
        <h2 className="text-2xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="bg-primary hover:bg-primary/90 text-white border-0 ml-auto"
          >
            <MailOpen className="mr-2 h-4 w-4" /> Mark All as Read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
              <div className="w-full flex justify-center space-x-1 mt-4">
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTabChange("all")}
                  className={activeTab === "all" ? "bg-primary text-white" : ""}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={activeTab === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTabChange("unread")}
                  className={
                    activeTab === "unread" ? "bg-primary text-white" : ""
                  }
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={activeTab === "read" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTabChange("read")}
                  className={
                    activeTab === "read" ? "bg-primary text-white" : ""
                  }
                >
                  Read ({notifications.length - unreadCount})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pt-0 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Inbox className="h-12 w-12 mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 flex items-start space-x-3 border-b cursor-pointer transition-colors duration-200 ${
                        notification.read
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "bg-white hover:bg-blue-50"
                      } ${
                        selectedNotification?.id === notification.id
                          ? getNotificationTypeColor(notification.type)
                          : ""
                      }`}
                      onClick={() => handleViewDetails(notification.id)}
                    >
                      <div className="mt-1">
                        {getNotificationTypeIcon(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <h3
                            className={`font-medium ${
                              notification.read
                                ? "text-gray-700"
                                : "text-primary"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge
                              variant="secondary"
                              className="bg-primary text-white"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {notification.date} · {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {selectedNotification ? (
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader
                className={`bg-gradient-to-r from-primary/10 to-white`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getNotificationTypeIcon(selectedNotification.type)}
                    <CardTitle className="text-xl">
                      {selectedNotification.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNotification(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {selectedNotification.date} at {selectedNotification.time}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="prose">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedNotification.body}
                  </p>

                  {selectedNotification.details && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Additional Details
                      </h4>
                      <p className="text-gray-700">
                        {selectedNotification.details}
                      </p>
                    </div>
                  )}

                  {selectedNotification.actionUrl && (
                    <div className="mt-6">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={() =>
                          (window.location.href =
                            selectedNotification.actionUrl)
                        }
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {selectedNotification.actionText || "View Details"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-center items-center py-12">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Bell className="h-16 w-16 mb-4 text-primary/30" />
                <p className="text-lg mb-2">
                  Select a notification to view details
                </p>
                <p className="text-sm text-gray-400">
                  Click on any notification from the list to see more
                  information
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
