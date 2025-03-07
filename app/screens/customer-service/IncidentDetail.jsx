"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { acceptIncident, fetchIncident } from "@/app/services/incidentService";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  User,
  CreditCard,
  Tag,
  AlertCircle,
  Stamp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ModalComponent from "@/components/ModalComponent";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const IncidentDetail = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const incidentId = useSelector((state) => state.incidents.selectedIncidentId);
  const authToken = useSelector((state) => state.auth.token);

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("bank");

  const handleSubmit = () => {
    onSubmit(selectedOption, comment);
  };

  const handleAssign = (selectedOption, comment) => {
    console.log("Assigned to:", selectedOption);
    console.log("Comment:", comment);
    // Call API to assign incident
  };

  useEffect(() => {
    if (!authToken) {
      router.push("/login");
      return;
    }

    if (!incidentId) {
      setError("No incident ID provided");
      setLoading(false);
      return;
    }

    const getIncident = async () => {
      try {
        const data = await fetchIncident(authToken, incidentId);
        setIncident(data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch incident details");
      } finally {
        setLoading(false);
      }
    };

    getIncident();
  }, [authToken, router, incidentId]);

  const handleBack = () => {
    router.back();
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      "In Progress": "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Void: "bg-red-100 text-red-800",
      New: "bg-purple-100 text-purple-800",
    };

    const statusColor = statusColors[status] || "bg-gray-100 text-gray-800";

    return (
      <Badge
        className={`${statusColor} px-3 py-1 text-xs font-medium rounded-full`}
      >
        {status}
      </Badge>
    );
  };

  const handleAccept = async () => {
    try {
      const response = await acceptIncident(authToken, incidentId);
      console.log(response);
    } catch (error) {
      console.error("Error accepting incident:", error);
      // setError(error.message || "Failed to incident");
      setError("Incident has been responded to by another personnel");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    setSubmittingComment(true);
    // Add comment submission logic here
    setTimeout(() => {
      setComment("");
      setSubmittingComment(false);
      //  fetch updated comments here
    }, 1000);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <Skeleton className="h-10 w-60" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-8 w-full max-w-lg" />
            <div className="grid grid-cols-2 gap-6 w-full md:w-3/4 lg:w-2/3">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Incident
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Incidents
          </Button>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            No incident found
          </h2>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Incidents
          </Button>
        </div>
      </div>
    );
  }

  // Dummy data for demonstration - replace with actual data from your API
  const comments = [
    {
      id: 1,
      user: "John Doe",
      role: "Support Agent",
      content:
        "Customer called to follow up on the incident. Informed them that we're investigating the issue.",
      timestamp: "2025-03-06T14:30:00",
    },
    {
      id: 2,
      user: "Jane Smith",
      role: "Financial Analyst",
      content:
        "Transaction verified in the system. The funds were debited but not credited to the receiving account.",
      timestamp: "2025-03-06T16:45:00",
    },
  ];

  const logs = [
    {
      id: 1,
      action: "Incident Created",
      user: "System",
      timestamp: "2025-03-05T09:15:00",
    },
    {
      id: 2,
      action: "Assigned to Support Team",
      user: "John Doe",
      timestamp: "2025-03-05T10:30:00",
    },
    {
      id: 3,
      action: "Status Changed: New → In Progress",
      user: "John Doe",
      timestamp: "2025-03-05T10:32:00",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Button variant="ghost" onClick={handleBack} className="mr-4 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Incident #{incident.id}
            </h1>
          </div>
          <div className="flex space-x-3">
            {renderStatusBadge(
              incident.incident_status?.status_name || "In Progress"
            )}
            <span className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(incident.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="details"
              className="flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="flex items-center justify-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="flex items-center justify-center"
            >
              <Clock className="h-4 w-4 mr-2" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <div className="grid md:grid-cols-2 gap-6 w-full md:w-3/4 lg:w-2/3 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 bg-white p-4 rounded-md border border-gray-200">
                  {incident.details || "No description provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm flex items-center mb-1">
                  <User className="h-4 w-4 mr-1" /> Account Name
                </p>
                <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
                  {incident.account_name}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm flex items-center mb-1">
                  <CreditCard className="h-4 w-4 mr-1" /> Account Number
                </p>
                <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200 font-mono">
                  {incident.account_number}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm flex items-center mb-1">
                  <Tag className="h-4 w-4 mr-1" /> Transaction Type
                </p>
                <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
                  {incident.transaction_type?.name}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm flex items-center mb-1">
                  <FileText className="h-4 w-4 mr-1" /> Transaction Reference
                </p>
                <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200 font-mono">
                  {incident.transaction_ref}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-1" /> Incident Date
                </p>
                <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
                  {new Date(incident.incident_date).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm flex items-center mb-1">
                  <FileText className="h-4 w-4 mr-1" /> Proof
                </p>
                <p className="text-md font-medium text-gray-900 bg-white p-3 rounded-md border border-gray-200">
                  {incident.proof ? (
                    <a
                      href={incident.proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Proof
                    </a>
                  ) : (
                    "No proof provided"
                  )}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Comment
              </h3>
              <div className="mb-6">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your comment here..."
                  className="min-h-24 resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={handleComment}
                    disabled={!comment.trim() || submittingComment}
                    className="w-32"
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">
                Comments History
              </h3>
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-md border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            {item.user}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({item.role})
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-md border border-gray-200 text-center">
                  <p className="text-gray-600">No comments yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Incident Logs Tab */}
          <TabsContent value="logs">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Activity Timeline
              </h3>
              {logs.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  {logs.map((log, index) => (
                    <div key={log.id} className="mb-6 ml-12 relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-12 mt-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>

                      <div className="bg-white p-4 rounded-md border border-gray-200">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">
                            {log.action}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">By: {log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-md border border-gray-200 text-center">
                  <p className="text-gray-600">No activity logs available.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <Button
            onClick={handleAccept}
            className="py-2 h-11 bg-green-600 hover:bg-green-700 text-white"
          >
            <Stamp className="h-5 w-5 mr-2" />
            Accept
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="py-2 h-11">
            <User className="h-5 w-5 mr-2" />
            Assign
          </Button>

          <Button className="py-2 h-11 bg-yellow-600 hover:bg-yellow-700 text-white">
            <Clock className="h-5 w-5 mr-2" />
            Escalate
          </Button>
          <Button className="py-2 h-11 bg-red-600 hover:bg-red-700 text-white">
            Void Incident
          </Button>
        </div>
      </div>
      <ModalComponent
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Incident"
        options={[
          { value: "bank", label: "Bank" },
          { value: "police", label: "Nigerian Police Force" },
        ]}
        onConfirm={handleAssign}
        confirmLabel="Assign"
      >
        <div>
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-2"
          >
            <Label className="flex items-center space-x-2">
              <RadioGroupItem value="bank" />
              <span>Bank</span>
            </Label>
            <Label className="flex items-center space-x-2">
              <RadioGroupItem value="police" />
              <span>Nigerian Police Force</span>
            </Label>
          </RadioGroup>

          <div className="mt-4">
            <Label>Comment</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="mt-2"
            />
          </div>

          <button className="hidden" onClick={handleSubmit} />
        </div>
      </ModalComponent>
    </div>
  );
};

export default IncidentDetail;
