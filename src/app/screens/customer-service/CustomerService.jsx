"use client";
import { fetchIncidents } from "@/app/services/incidentService";
import { getIncidents } from "@/app/store/slices/incidentsSlice";
import TableComponent from "@/components/TableComponent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CustomerService = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const incidentsState = useSelector((state) => state.incidents);
  const {
    incidents = [],
    loading = false,
    error = null,
  } = incidentsState || {};

  useEffect(() => {
    if (authToken) {
      dispatch(getIncidents(authToken));
    }
  }, [dispatch, authToken]);

  const columns = [
    { key: "incidentId", header: "Incident ID" },
    { key: "reportedBy", header: "Reported By" },
    { key: "dateCreated", header: "Date Created" },
    { key: "transactionType", header: "Transaction Type" },
    { key: "transactionReference", header: "Transaction Reference" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            row.status === "Resolved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <button
          onClick={() => handleRowClick(row)}
          className="text-blue-500 hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  const handleRowClick = (row) => {
    router.push(`/customer-service/incident-detail/${row.incidentId}`);
  };

  // Transform API response to match table structure
  const formattedData = incidents?.map((item) => ({
    incidentId: item.incident?.id || "-",
    reportedBy:
      item.incident?.user?.first_name + " " + item.incident?.user?.last_name ||
      "-",
    dateCreated:
      new Date(item.incident?.created_at).toLocaleDateString() || "-",
    transactionType: item.incident?.transaction_type?.name || "-",
    transactionReference: item.incident?.transaction_ref || "-",
    status: item.incident?.incident_status?.status_name || "Pending",
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Incidents</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && formattedData.length > 0 ? (
        <TableComponent
          data={formattedData}
          columns={columns}
          onRowClick={handleRowClick}
        />
      ) : (
        <p>No incidents found.</p>
      )}
    </div>
  );
};

export default CustomerService;
