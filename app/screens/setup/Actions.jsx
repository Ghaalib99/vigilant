"use client";
import React, { useEffect, useState } from "react";
import {
  fetchPendingActions,
  fetchApprovedActions,
  fetchDeclinedActions,
  approveAction,
  declineAction,
} from "@/app/services/setupService";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import TableComponent from "@/components/TableComponent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

const Actions = () => {
  const router = useRouter();
  const { user } = useAuth();
  const authToken = useSelector((state) => state.auth.token);
  const [pending, setPending] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [comment, setComment] = useState("");
  const [currentPid, setCurrentPid] = useState(null);

  const isInputter = user?.role?.name === "npf-admin-inputter";

  const fetchActions = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pendingResponse, approvedResponse, declinedResponse] =
        await Promise.all([
          fetchPendingActions(authToken),
          fetchApprovedActions(authToken),
          fetchDeclinedActions(authToken),
        ]);

      if (pendingResponse?.success) setPending(pendingResponse.data || []);
      if (approvedResponse?.success) setApproved(approvedResponse.data || []);
      if (declinedResponse?.success) setDeclined(declinedResponse.data || []);

      if (
        !pendingResponse?.success ||
        !approvedResponse?.success ||
        !declinedResponse?.success
      ) {
        throw new Error("Failed to fetch some action data");
      }
    } catch (error) {
      console.error("Error fetching actions:", error);
      setError(error.message || "Failed to fetch actions");
      toast({
        title: "Error",
        description: "Could not load actions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [authToken]);

  const handleAction = async (actionFn, pid, successMessage) => {
    try {
      setActionLoading(true);
      const response = await actionFn(authToken, {
        pid,
        comment,
      });

      if (response?.success) {
        toast(response.message);
        await fetchActions();
        setComment("");
        setCurrentPid(null);
      } else {
        throw new Error(response?.message || "Action failed");
      }
    } catch (error) {
      console.error("Error performing action:", error);
      toast(response.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = (pid) =>
    handleAction(approveAction, pid, "Action approved successfully.");
  const handleDecline = (pid) =>
    handleAction(declineAction, pid, "Action declined successfully.");

  if (loading) return <Loading />;

  const commonColumns = [
    {
      key: "name",
      header: "Name",
      render: (row) => `${row.first_name} ${row.last_name}`,
    },
    { key: "email", header: "Email" },
    { key: "purpose", header: "Purpose" },
    { key: "phone", header: "Phone" },
  ];

  const pendingColumns = [
    ...commonColumns,
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600"
                onClick={() => setCurrentPid(row.pid)}
              >
                Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve this action?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <textarea
                value={currentPid === row.pid ? comment : ""}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleApprove(row.pid)}
                  className="bg-green-600"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600"
                onClick={() => setCurrentPid(row.pid)}
              >
                Decline
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Decline</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to decline this action?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <textarea
                value={currentPid === row.pid ? comment : ""}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                className="w-full block p-2 mb-2 border border-gray-300 rounded"
              />
              <AlertDialogFooter className="flex-col">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDecline(row.pid)}
                  className="bg-red-600"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const getColumns = () => {
    switch (activeTab) {
      case "pending":
        return pendingColumns;
      case "approved":
      case "declined":
      default:
        return commonColumns;
    }
  };

  return (
    <>
      <div className="w-full flex items-center  my-4 mb-8">
        <ChevronLeft
          onClick={() => router.back()}
          size={25}
          className="cursor-pointer mr-4"
        />
        <h2 className="text-2xl font-bold">Actions</h2>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Actions Management</CardTitle>
          {error && <div className="text-red-500">{error}</div>}
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="declined">Declined</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <TableComponent
                data={pending}
                columns={getColumns()}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="approved">
              <TableComponent
                data={approved}
                columns={getColumns()}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="declined">
              <TableComponent
                data={declined}
                columns={getColumns()}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default Actions;
