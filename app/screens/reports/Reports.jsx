"use client";
import {
  fetchIncidents,
  acceptIncident,
  fetchAllIncidents,
  fetchIncidentTypes,
} from "@/app/services/incidentService";
import TableComponent from "@/components/TableComponent";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SearchIcon,
  Filter,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  BarChart2,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/Loading";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "react-hot-toast";
import {
  getIncidents,
  setAssignmentId,
  setBankId,
  setIncidentId,
  setIncidentStatus,
} from "@/app/store/slices/incidentsSlice";
import Papa from "papaparse";

import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setFromReports } from "@/app/store/slices/fromReportsSlice";

const IncidentsReport = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const incidentsState = useSelector((state) => state.incidents);
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [incidents, setIncidents] = useState();
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [meta, setMeta] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [currentTab, setCurrentTab] = useState("all");

  const stats = useMemo(() => {
    if (!incidents || !incidents.length)
      return {
        total: 0,
        pending: 0,
        accepted: 0,
        declined: 0,
        fraudCases: 0,
        theftCases: 0,
      };

    return {
      total: incidents.length,
      pending: incidents.filter((item) => item.acceptance_status === "pending")
        .length,
      accepted: incidents.filter(
        (item) => item.acceptance_status === "accepted"
      ).length,
      declined: incidents.filter(
        (item) => item.acceptance_status === "declined"
      ).length,
      fraudCases: incidents.filter(
        (item) => item.incident?.transaction_type?.name === "Fraud"
      ).length,
      theftCases: incidents.filter(
        (item) => item.incident?.transaction_type?.name === "Theft"
      ).length,
    };
  }, [incidents]);

  const getAllIncidents = async (page = 1, perPage = 4) => {
    setLoading(true);
    try {
      const response = await fetchAllIncidents(authToken, page, perPage);
      setIncidents(response?.data);
      setMeta(response?.meta);
      setCurrentPage(response?.meta?.current_page || 1);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIncidentTypes = async () => {
    setLoading(true);
    try {
      const response = await fetchIncidentTypes(authToken);
      // console.log("Incident Types Response:", response);
      setIncidentTypes([...response.data]);
    } catch (error) {
      console.error("Error fetching incident types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      getAllIncidents();
      getIncidentTypes();
    }
  }, [authToken]);

  const handleRefresh = () => {
    toast.success("Refreshing incidents...");
    getAllIncidents();
    setTypeFilter("all");
  };

  const formattedData = useMemo(() => {
    return incidents
      ?.slice()
      .reverse()
      .map((item, index) => ({
        sno: index + 1,
        incidentId: item.incident?.id || "-",
        assignmentId: item.id || "-",
        bankId: item.incident?.bank?.id,
        reportedBy:
          item.incident?.user?.first_name +
            " " +
            item.incident?.user?.last_name || "-",
        dateCreated:
          new Date(item.incident?.created_at).toLocaleDateString("en-GB") ||
          "-",
        transactionType: item.incident?.transaction_type?.name || "-",
        transactionReference: item.incident?.transaction_ref || "-",
        amount: `₦${parseFloat(item.incident?.amount).toLocaleString() || "0"}`,
        accountName: item.incident?.account_name || "-",
        accountNumber: item.incident?.account_number || "-",
        bank: item.incident?.bank?.bank_name || "-",
        status:
          item?.acceptance_status?.charAt(0).toUpperCase() +
          item?.acceptance_status?.slice(1),
        details: item.incident?.details || "-",
        originalData: item,
      }));
  }, [incidents]);

  const filteredData = useMemo(() => {
    if (!formattedData) return [];

    return formattedData.filter((item) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        item.transactionReference
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.incidentId.toString().includes(searchTerm) ||
        item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accountNumber.includes(searchTerm) ||
        item.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();

      // Type filter
      const matchesType =
        typeFilter === "all" ||
        item.transactionType.toLowerCase() === typeFilter.toLowerCase();

      // Date filter to be implemented if needed

      // Apply for current tab
      const matchesTab =
        currentTab === "all" ||
        (currentTab === "pending" && item.status === "Pending") ||
        (currentTab === "accepted" && item.status === "Accepted") ||
        (currentTab === "declined" && item.status === "Declined");

      return matchesSearch && matchesStatus && matchesType && matchesTab;
    });
  }, [searchTerm, statusFilter, typeFilter, formattedData, currentTab]);

  const columns = [
    {
      key: "sno",
      header: "S/N",
      render: (row) => (
        <span className="font-medium text-gray-900">{row.sno}</span>
      ),
    },
    { key: "reportedBy", header: "Reported By" },
    {
      key: "dateCreated",
      header: "Date",
      render: (row) => <span className="text-gray-600">{row.dateCreated}</span>,
    },
    {
      key: "transactionType",
      header: "Type",
      render: (row) => (
        <Badge
          variant={
            row.transactionType === "Fraud" ? "destructive" : "secondary"
          }
          className="max-w-[100px] truncate"
        >
          {row.transactionType}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => <span className="font-medium">{row.amount}</span>,
    },
    {
      key: "transactionReference",
      header: "Transaction Ref",
      render: (row) => (
        <span className="font-mono text-xs">
          {row.transactionReference || "N/A"}
        </span>
      ),
    },
    {
      key: "bank",
      header: "Bank",
      render: (row) => (
        <span className="text-xs max-w-[100px] truncate inline-block">
          {row.bank}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        let statusColor = "";
        let icon = null;

        switch (row.status) {
          case "Accepted":
            statusColor = "bg-green-100 text-green-800";
            icon = <CheckCircle className="inline-block mr-1 h-3 w-3" />;
            break;
          case "Pending":
            statusColor = "bg-orange-100 text-orange-800";
            icon = <Clock className="inline-block mr-1 h-3 w-3" />;
            break;
          case "Declined":
            statusColor = "bg-red-100 text-red-800";
            icon = <XCircle className="inline-block mr-1 h-3 w-3" />;
            break;
          default:
            statusColor = "bg-blue-100 text-blue-800";
            break;
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${statusColor}`}
          >
            {icon} {row.status}
          </span>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <Button
          // onClick={() => handleViewDetails(row)}
          variant="outline"
          size="sm"
          className="flex items-center bg-transparent border-primary text-primary hover:bg-primary/10"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  const handleViewDetails = (row) => {
    dispatch(setIncidentId(row.incidentId));
    dispatch(setAssignmentId(row.assignmentId));
    dispatch(setBankId(row.bankId));
    dispatch(setIncidentStatus(row.status));
    dispatch(setFromReports(true));

    router.push(
      `/dashboard/incidents/incident-detail/${row.incidentId}?from=reports`
    );
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

  const exportToCSV = () => {
    const data = filteredData.map((item) => ({
      ID: item.incidentId,
      "Reported By": item.reportedBy,
      Date: item.dateCreated,
      Type: item.transactionType,
      Amount: item.amount,
      "Transaction Ref": item.transactionReference,
      Bank: item.bank,
      Status: item.status,
    }));

    const csv = Papa.unparse(data, {
      header: true, // Include headers in the CSV
    });

    // Create a Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "incident_reports.csv";
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success("Data exported to CSV successfully!");
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.text("Incident Reports", 14, 16);

      // Create a table manually without autoTable
      const tableData = filteredData.map((item) => [
        item.incidentId,
        item.reportedBy,
        item.dateCreated,
        item.transactionType,
        item.amount,
        item.transactionReference.substring(0, 10), // Trim long references
        item.bank,
        item.status,
      ]);

      // Table headers
      const headers = [
        "ID",
        "Reported By",
        "Date",
        "Type",
        "Amount",
        "Ref",
        "Bank",
        "Status",
      ];

      // Set starting position
      let y = 30;
      const rowHeight = 10;
      const colWidth = 25;

      // Draw headers
      doc.setFillColor(220, 220, 220);
      doc.setDrawColor(0);
      doc.rect(10, y, colWidth * headers.length, rowHeight, "FD");
      doc.setFontSize(10);
      doc.setTextColor(0);

      headers.forEach((header, i) => {
        doc.text(header, 12 + i * colWidth, y + 7);
      });

      // Draw rows
      y += rowHeight;
      tableData.forEach((row, rowIndex) => {
        // Alternate row background for readability
        if (rowIndex % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(10, y, colWidth * headers.length, rowHeight, "F");
        }

        row.forEach((cell, i) => {
          // Convert cell to string and limit length
          const text = String(cell || "").substring(0, 15);
          doc.text(text, 12 + i * colWidth, y + 7);
        });

        y += rowHeight;

        // Add new page if necessary
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });

      // Save the PDF
      doc.save("incident_reports.pdf");

      // Notify the user
      toast.success("Data exported to PDF successfully!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export data to PDF.");
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Incident Reports
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track all reported incidents
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <File className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">
                Total Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-3xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">
                Pending Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500 mr-2" />
                <span className="text-3xl font-bold">{stats.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">
                Accepted Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-3xl font-bold">{stats.accepted}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-700">
                Declined Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-3xl font-bold">{stats.declined}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full mb-6"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList className="w-full md:w-auto grid grid-cols-4 h-auto">
            <TabsTrigger value="all" className="py-2">
              All Incidents
              <Badge variant="outline" className="ml-2">
                {stats.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="py-2">
              Pending
              <Badge
                variant="outline"
                className="ml-2 bg-orange-100 text-orange-800 border-orange-200"
              >
                {stats.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="py-2">
              Accepted
              <Badge
                variant="outline"
                className="ml-2 bg-green-100 text-green-800 border-green-200"
              >
                {stats.accepted}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="declined" className="py-2">
              Declined
              <Badge
                variant="outline"
                className="ml-2 bg-red-100 text-red-800 border-red-200"
              >
                {stats.declined}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                {/* Search and Filters */}
                <div className="bg-white p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Search ID, reference, name..."
                      className="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <span className="text-gray-400 hover:text-gray-600">
                          ✕
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap md:flex-nowrap w-full md:w-auto">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full md:w-36 h-9 text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full md:w-36 h-9 text-sm">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {incidentTypes.length > 0 ? (
                          incidentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>No types available</SelectItem>
                        )}
                      </SelectContent>
                      ;
                    </Select>
                  </div>
                </div>

                {/* Table */}
                {loading ? (
                  <div className="p-8">
                    <Loading />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 m-4 rounded-md flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <p>{error}</p>
                  </div>
                ) : filteredData.length > 0 ? (
                  <div className="overflow-hidden">
                    <TableComponent
                      data={filteredData}
                      columns={columns}
                      onRowClick={handleRowClick}
                      className="min-w-full divide-y divide-gray-200"
                      headerClassName="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      rowClassName="bg-white hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      cellClassName="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                      meta={meta}
                      onPageChange={(page) => getAllIncidents(page)}
                      loading={loading}
                    />
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 p-8 m-4 rounded-md text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-lg font-medium">No incidents found</p>
                    <p className="text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-200 p-4">
                <div className="w-full flex items-center justify-between text-sm text-gray-500">
                  {filteredData.length > 0 && (
                    <p>
                      Showing {filteredData.length} of{" "}
                      {formattedData?.length || 0} incidents
                    </p>
                  )}
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1 text-gray-400" />
                    <span>
                      {stats.fraudCases} fraud cases, {stats.theftCases} theft
                      cases
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8">
                    <Loading />
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <TableComponent
                      data={filteredData}
                      columns={columns}
                      onRowClick={handleRowClick}
                      className="min-w-full divide-y divide-gray-200"
                      headerClassName="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      rowClassName="bg-white hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      cellClassName="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accepted">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8">
                    <Loading />
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <TableComponent
                      data={filteredData}
                      columns={columns}
                      onRowClick={handleRowClick}
                      className="min-w-full divide-y divide-gray-200"
                      headerClassName="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      rowClassName="bg-white hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      cellClassName="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="declined">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8">
                    <Loading />
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <TableComponent
                      data={filteredData}
                      columns={columns}
                      onRowClick={handleRowClick}
                      className="min-w-full divide-y divide-gray-200"
                      headerClassName="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      rowClassName="bg-white hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      cellClassName="px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IncidentsReport;
