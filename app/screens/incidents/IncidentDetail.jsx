"use client";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  acceptIncident,
  addComment,
  assignIncident,
  declineIncident,
  fetchBanks,
  fetchEntities,
  fetchIncident,
  fetchSegments,
} from "@/app/services/incidentService";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  User,
  AlertCircle,
  Mouse,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IncidentDetailsTab } from "@/components/incidents/IncidentDetailsTab";
import { CommentsTab } from "@/components/incidents/CommentsTab";
import { AssignModal } from "@/components/incidents/AssignModal";
import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";
import { updateIncidentStatus } from "@/app/store/slices/incidentsSlice";
import ActivityLogTab from "@/components/incidents/ActivityLogTab";

const IncidentDetail = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const incidentId = useSelector((state) => state.incidents.selectedIncidentId);
  const assignmentId = useSelector(
    (state) => state.incidents.selectedAssignmentId
  );
  const bankId = useSelector((state) => state.incidents.selectedBankId);
  const acceptanceStatus = useSelector(
    (state) => state.incidents.selectedIncidentStatus
  );

  const authToken = useSelector((state) => state.auth.token);

  const { user } = useAuth();
  const nonAssigningPersonnel =
    user?.role?.name === "npf-prosecutor" ||
    user?.role?.name === "bank-finance";

  const [incident, setIncident] = useState(null);
  const [banks, setBanks] = useState([]);
  const [segments, setSegments] = useState([]);
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState();
  const [selectedBank, setSelectedBank] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNpf, setIsNpf] = useState("");
  const [isBank, setIsBank] = useState("");
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [tabValue, setTabValue] = useState("details");

  const handleAssign = async (selectedOption, comment, selectedBank) => {
    try {
      let entityIdToUse = null;

      if (selectedOption === "bank") {
        entityIdToUse = isBank;
      } else if (selectedOption === "police") {
        entityIdToUse = isNpf;
      }
      console.log(entityIdToUse);
      if (!entityIdToUse) {
        setError("Entity ID not found for the selected option");
        return;
      }

      if (!selectedSegment || !selectedSegment.id) {
        setError("No segment available for the selected entity");
        return;
      }

      const payload = {
        incident_assignment_id: assignmentId.toString(),
        segment_id: selectedSegment.id.toString(),
        incident_id: incidentId.toString(),
        // bank_id: selectedBank ? selectedBank.toString() : "",
        bank_id:
          selectedOption === "bank" ? (bankId ? bankId.toString() : "") : "",
        entity_id: entityIdToUse.toString(),
        comment: comment,
      };

      console.log(payload);

      const response = await assignIncident(authToken, JSON.stringify(payload));

      if (response?.status === true) {
        toast.success("Incident assigned successfully");
      } else {
        toast.error(response?.message);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error assigning incident:", error);
      toast.error("Failed to assign incident");
      setError(error.message || "Failed to assign incident");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleResponse = async (action) => {
    try {
      setIsResponseModalOpen(false);

      if (action === "accept") {
        await acceptIncident(authToken, assignmentId);
        setHasResponded(true);
        dispatch(updateIncidentStatus({ incidentId, status: "Accepted" }));
      } else if (action === "decline") {
        await declineIncident(authToken, assignmentId);
        router.back();
      }
    } catch (error) {
      console.error("Error responding to incident:", error);
      setError("Incident has been responded to by another personnel");
    }
  };

  useEffect(() => {
    if (!authToken) {
      router.push("/");
      return;
    }
    if (!incidentId) {
      setError("No incident ID provided");
      setLoading(false);
      return;
    }
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [incidentResponse] = await Promise.all([
          fetchIncident(authToken, incidentId),
        ]);
        setIncident(incidentResponse?.data);

        if (!nonAssigningPersonnel) {
          const [entitiesResponse, banksResponse] = await Promise.all([
            fetchEntities(authToken),
            fetchBanks(authToken),
          ]);
          setEntities(entitiesResponse?.data);
          setBanks(banksResponse?.data);

          if (entitiesResponse?.data) {
            const NPFVigilantEntity = entitiesResponse.data.find(
              (entity) => entity.name === "NPFVigilant"
            );
            if (NPFVigilantEntity) {
              setIsNpf(NPFVigilantEntity.id);
            }
            const bankEntity = entitiesResponse.data.find(
              (entity) => entity.name === "Bank"
            );
            if (bankEntity) {
              setIsBank(bankEntity.id);
            }
          }
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [authToken, router, incidentId, nonAssigningPersonnel]);

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

  const getBanks = useCallback(async () => {
    try {
      setLoading(true);
      if (banks && banks.length > 0) {
        setLoading(false);
        return;
      }

      const data = await fetchBanks(authToken);
      if (data?.data && Array.isArray(data.data)) {
        setBanks(data.data);
      } else {
        console.error("Invalid banks data format:", data);
        setBanks([]);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      setError(error.message || "Failed to fetch banks");
      setBanks([]);
    } finally {
      setLoading(false);
    }
  }, [authToken, banks]);

  const getEntities = async () => {
    try {
      setLoading(true);
      const data = await fetchEntities(authToken);
      await setEntities(data?.data);
      if (data?.data) {
        const NPFVigilantEntity = data.data.find((entity) => {
          return entity.name && entity.name === "NPFVigilant";
        });
        setIsNpf(NPFVigilantEntity.id);

        const bankEntity = data.data.find((entity) => {
          return entity.name && entity.name === "Bank";
        });
        setIsBank(bankEntity.id);
      }
    } catch (error) {
      console.error("Error fetching entities:", error);
      setError(error.message || "Failed to fetch entities");
    } finally {
      setLoading(false);
    }
  };

  const getSegments = useCallback(
    async (entityType) => {
      console.log("Getting segments for:", entityType); // Add this log
      const entityIdToUse = entityType === "bank" ? isBank : isNpf;

      console.log("Entity ID being used:", entityIdToUse); // Add this log

      if (!entityIdToUse || !incidentId) {
        console.error("No entity ID or incident ID available for segments");
        return;
      }

      const payload = {
        incident_id: incidentId,
        segment_entity_id: entityIdToUse,
      };

      try {
        const data = await fetchSegments(authToken, payload);
        console.log("Segments response:", data); // Add this log
        setSegments(data?.data || []);

        if (data?.data && data.data.length > 0) {
          setSelectedSegment(data.data[0]);
        } else {
          setSelectedSegment(null);
        }
      } catch (error) {
        console.error("Error fetching segments:", error);
        setError(error.message || "Failed to fetch segments");
      }
    },
    [incidentId, isBank, isNpf, authToken]
  );

  if (loading) {
    return <Loading />;
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

  const handleAssignModal = async () => {
    setIsModalOpen(true);
  };

  const assignFromResponse = () => {
    setIsResponseModalOpen(false);
    handleAssignModal();
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
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
          <TabsList className="grid w-full grid-cols-3 mb-2">
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
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              {!nonAssigningPersonnel && (
                <>
                  <Button
                    onClick={() => setIsResponseModalOpen(true)}
                    disabled={hasResponded}
                    className="py-2 h-11 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Mouse className="h-5 w-5 mr-2" />
                    Respond
                  </Button>
                  {acceptanceStatus !== "Pending" && (
                    <Button onClick={handleAssignModal} className="py-2 h-11">
                      <User className="h-5 w-5 mr-2" />
                      Assign
                    </Button>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <CommentsTab />
          </TabsContent>

          {/* Incident Logs Tab */}
          <TabsContent value="logs">
            <ActivityLogTab logs={[]} />
          </TabsContent>
        </Tabs>
      </div>
      <AssignModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleAssign={handleAssign}
        banks={banks}
        entities={entities}
        getSegments={getSegments}
        segments={segments}
        selectedSegment={selectedSegment}
        setSelectedSegment={setSelectedSegment}
      />
      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        {acceptanceStatus === "Pending" ? (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Respond to Incident</DialogTitle>
              <DialogDescription>
                {user?.role?.name !== "vgn-customer-service"
                  ? "Would you like to accept or decline this incident?"
                  : "Proceed to accept incident."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center space-x-4 mt-2">
              <Button
                onClick={() => handleResponse("accept")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Accept
              </Button>
              {user?.role?.name !== "vgn-customer-service" && (
                <Button
                  onClick={() => handleResponse("decline")}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  Decline
                </Button>
              )}
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Incident Already Responded To</DialogTitle>
              <div className="pt-8">
                You can no longer respond to this incident because it has
                previously been{" "}
                {acceptanceStatus === "Accepted" ? "accepted" : "declined"}.
                {acceptanceStatus === "Accepted" ? (
                  <div className="mt-2 w-full">
                    <p>You can proceed to assign</p>
                    <Button
                      onClick={assignFromResponse}
                      className="py-2 h-11 mt-3 w-full"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Assign
                    </Button>
                  </div>
                ) : (
                  ""
                )}
                .
              </div>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default IncidentDetail;
