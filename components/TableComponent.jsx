import React from "react";
import { Button } from "@/components/ui/button";

const TableComponent = ({
  data,
  columns,
  onRowClick,
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  meta,
  onPageChange,
  loading,
}) => {
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const currentPage = meta?.current_page || 1;
  const totalPages = meta?.last_page || 1;
  const from = meta?.from || 0;
  const to = meta?.to || 0;
  const total = meta?.total || 0;

  if (data.length === 0 && !loading) {
    return (
      <div className="p-6 text-center text-gray-500">No data available.</div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table
        className={
          className || "w-full table-layout-fixed border border-gray-200"
        }
      >
        <thead className="sticky top-0 text-left bg-white">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={headerClassName || "w-1/2 py-2 px-4 border-b"}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={rowClassName || "hover:bg-gray-50 cursor-pointer"}
            >
              {columns.map((column) => (
                <td
                  key={`${column.key}-${rowIndex}`}
                  className={
                    cellClassName || "py-3 px-4 border-b max-w-[200px]"
                  }
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {meta && (
        <div className="flex justify-between items-center p-4 border-t">
          <div>
            <span className="text-sm text-gray-500">
              {total > 0
                ? `Showing ${from} to ${to} of ${total} entries`
                : "No entries found"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>

            {/* Page number indicators */}
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                // Logic to show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }

                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
