"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addComment,
  assignIncident,
  fetchIncident,
} from "@/app/services/incidentService";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  User,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IncidentDetailsTab } from "@/components/customer-service/IncidentDetailsTab";
import { CommentsTab } from "@/components/customer-service/CommentsTab";
import { ActivityLogTab } from "@/components/customer-service/ActivityLogTab";
import { AssignModal } from "@/components/customer-service/AssignModal";
import Loading from "@/components/Loading";

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

  const handleAssign = async (selectedOption, comment) => {
    try {
      const response = await assignIncident(authToken, {
        incident_assignment_id: "1",
        segment_id: incident?.incident_status?.id,
        incident_id: incidentId,
        bank_id: incident?.bank?.id,
        entity_id: "1",
        comment: comment,
        assignment_type: selectedOption,
      });
      console.log(response);
    } catch (error) {
      console.error("Error assigning incident:", error);
    } finally {
      setSubmittingComment(false);
    }
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
        console.log(data?.data);
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

  const handleAddComment = async () => {
    try {
      const response = await addComment(authToken, {
        incidet_id: incidentId,
        comment: "",
      });
      console.log(response);
    } catch (error) {
      console.error("Error accepting incident:", error);
      // setError(error.message || "Failed to incident");
      setError("Incident has been responded to by another personnel");
    }
  };

  if (loading) {
    return <Loading />;
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
            <IncidentDetailsTab incident={incident} />
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <CommentsTab incidentId={incidentId} authToken={authToken} />
          </TabsContent>

          {/* Incident Logs Tab */}
          <TabsContent value="logs">
            <ActivityLogTab logs={[]} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
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
      <AssignModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleAssign={handleAssign}
      />
    </div>
  );
};

export default IncidentDetail;
