"use client";
import React, { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Bell, MailOpen, Inbox } from "lucide-react";
import {
  fetchAllNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/app/services/notificationService";
import { useSelector } from "react-redux";

export default function Notifications() {
  const authToken = useSelector((state) => state.auth.token);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await fetchAllNotifications(authToken);
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark a single notification as read
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

  // Mark all notifications as read
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

  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading notifications...</p>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-500">
            <Bell className="mr-2" /> Notifications Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Render notifications
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 mt-4">Notifications</h2>

      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="mr-2" /> Notifications
          </CardTitle>
          {notifications.some((n) => !n.read) && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <MailOpen className="mr-2 h-4 w-4" /> Mark All Read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Inbox className="h-12 w-12 mb-4" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg flex items-start space-x-4 ${
                    notification.read
                      ? "bg-gray-50 opacity-70"
                      : "bg-white border-blue-100"
                  }`}
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="secondary">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.body}
                    </p>
                    <div className="text-xs text-gray-500 flex justify-between items-center">
                      <span>
                        {notification.date} at {notification.time}
                      </span>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

const not = [
  {
    id: "c16940d4-4657-48f6-af10-604c63952c5d",
    title: "New Reply",
    body: "A new reply has been added",
    read: false,
    date: "2025-03-03",
    time: "01:44 pm",
  },
  {
    id: "c61b8f6a-4843-4b6f-8d57-1f41461f1173",
    title: "Login",
    body: "Login successful",
    read: false,
    date: "2025-03-03",
    time: "01:05 pm",
  },
];
