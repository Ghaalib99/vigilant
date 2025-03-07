"use client";
import { fetchIncidents } from "@/app/services/incidentService";
import {
  getIncidents,
  saveIncidentId,
} from "@/app/store/slices/incidentsSlice";
import TableComponent from "@/components/TableComponent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchCheckIcon } from "lucide-react";

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

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authToken) {
      dispatch(getIncidents(authToken));
    }
  }, [dispatch, authToken]);

  const formattedData = useMemo(() => {
    return incidents
      ?.slice()
      .reverse()
      .map((item) => ({
        incidentId: item.incident?.id || "-",
        reportedBy:
          item.incident?.user?.first_name +
            " " +
            item.incident?.user?.last_name || "-",
        dateCreated:
          new Date(item.incident?.created_at).toLocaleDateString() || "-",
        transactionType: item.incident?.transaction_type?.name || "-",
        transactionReference: item.incident?.transaction_ref || "-",
        status: "In Progress",
        originalData: item.incident,
      }));
  }, [incidents]);

  const filteredData = useMemo(() => {
    if (!formattedData) return [];

    return formattedData.filter(
      (item) =>
        item.transactionReference
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.incidentId.toString().includes(searchTerm)
    );
  }, [searchTerm, formattedData]);

  const columns = [
    {
      key: "incidentId",
      header: "Incident ID",
      render: (row) => (
        <span className="font-medium text-gray-900">{row.incidentId}</span>
      ),
    },
    { key: "reportedBy", header: "Reported By" },
    {
      key: "dateCreated",
      header: "Date Created",
      render: (row) => <span className="text-gray-600">{row.dateCreated}</span>,
    },
    { key: "transactionType", header: "Transaction Type" },
    {
      key: "transactionReference",
      header: "Transaction Reference",
      render: (row) => (
        <span className="font-mono text-sm">{row.transactionReference}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className="px-3 py-1 text-sm rounded-full font-medium bg-blue-100 text-blue-800">
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(row);
          }}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors duration-200"
        >
          View Details
        </button>
      ),
    },
  ];

  const handleViewDetails = (row) => {
    const incidentId = row.incidentId;
    console.log("incidentId:", incidentId);
    dispatch(saveIncidentId(incidentId));
    router.push(`/customer-service/incident-detail/${incidentId}`);
  };

  const handleRowClick = (row) => {
    handleViewDetails(row);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Incident Management
          </h1>

          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchCheckIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by transaction reference..."
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 hover:text-gray-600">✕</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <TableComponent
              data={filteredData}
              columns={columns}
              onRowClick={handleRowClick}
              className="min-w-full divide-y divide-gray-200"
              headerClassName="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              rowClassName="bg-white hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
              cellClassName="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            />
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 px-4 py-12 rounded-md text-center">
            <p className="text-lg">
              No incidents found matching your criteria.
            </p>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          {filteredData.length > 0 && (
            <p>
              Showing {filteredData.length} of {formattedData?.length || 0}{" "}
              incidents
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
