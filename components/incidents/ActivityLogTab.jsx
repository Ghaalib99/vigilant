"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { fetchIncidentlogs } from "@/app/services/incidentService";
import { useSelector } from "react-redux";
import Loading from "../Loading";

const ActivityLogTab = () => {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const incidentId = useSelector((state) => state.incidents.selectedIncidentId);
  const authToken = useSelector((state) => state.auth.token);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchIncidentlogs(authToken, incidentId);
      setLogs(response.data);
      setMeta(response.meta);
      setCurrentPage(response.meta.current_page);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage, incidentId]);

  // Helper to parse activity descriptions
  const parseActivity = (description) => {
    // Try to extract 'from' and 'to' entities for assignments
    if (description.includes("assign incident to")) {
      const parts = description.split("assign incident to");
      return {
        from: parts[0].trim(),
        action: "assigned to",
        to: parts[1].trim(),
      };
    }

    // Handle submissions
    if (description.includes("submit an incident")) {
      const parts = description.split("submit");
      return {
        from: parts[0].trim(),
        action: "submitted",
        to: "a new incident",
      };
    }

    // Default fallback
    return {
      from: "",
      action: description,
      to: "",
    };
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < meta.total_pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold mb-1">
                Activity Logs
              </CardTitle>
              <CardDescription>
                View all activity history for this incident
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="space-y-6">
                {logs.map((log, index) => {
                  const { from, action, to } = parseActivity(
                    log.log_description
                  );
                  const date = parseISO(log.created_at);

                  return (
                    <div key={index} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                          <User size={16} />
                        </div>
                        {index < logs.length - 1 && (
                          <div className="w-0.5 bg-gray-200 grow my-1 group-hover:bg-blue-200 transition-colors"></div>
                        )}
                      </div>

                      <div className="flex-1 pb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="font-medium">
                                {from && (
                                  <span className="text-blue-600">{from}</span>
                                )}
                                {action && (
                                  <span className="text-gray-700">
                                    {" "}
                                    {action}{" "}
                                  </span>
                                )}
                                {to && (
                                  <span className="text-blue-600">{to}</span>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock size={14} className="mr-1" />
                                <span>
                                  {format(date, "MMM d, yyyy 'at' h:mm a")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {meta.total_pages > 1 && (
                <div className="flex justify-between items-center py-4 border-t mt-4">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {meta.total_pages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === meta.total_pages}
                    >
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogTab;
