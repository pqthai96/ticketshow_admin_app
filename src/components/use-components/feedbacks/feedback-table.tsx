import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "@/api-client/api-client";
import { FeedbackDialogPanel } from "@/components/use-components/feedbacks/feedback-dialog-panel";
import { debounce } from "lodash";

export function FeedbackTable({ className }: { className?: string }) {
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for all feedbacks and filtered feedbacks
  const [allFeedbacks, setAllFeedbacks] = useState<any[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<any[]>([]);

  // Add state for client-side pagination
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Number of feedbacks per page

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Create a debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchText) => {
      if (!searchText.trim()) {
        applyFilters();
        return;
      }

      setIsSearching(true);

      // Filter locally based on search text
      const lowerSearchText = searchText.toLowerCase();
      const matched = allFeedbacks.filter(feedback =>
        feedback.userEmail?.toLowerCase().includes(lowerSearchText) ||
        feedback.subject?.toLowerCase().includes(lowerSearchText) ||
        feedback.message?.toLowerCase().includes(lowerSearchText)
      );

      // Apply status filter if needed
      let result = matched;
      if (statusFilter !== "all") {
        result = matched.filter(feedback =>
          feedback.status === statusFilter
        );
      }

      setFilteredFeedbacks(result);
      setIsSearching(false);
      setCurrentPage(0); // Reset to first page
    }, 500), // 500ms debounce delay
    [allFeedbacks, statusFilter]
  );

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Apply status filter whenever it changes
  useEffect(() => {
    applyFilters();
  }, [allFeedbacks, statusFilter]);

  const fetchFeedbacks = () => {
    setIsLoading(true);
    // Replace with your actual API endpoint for feedbacks
    axiosClient.get("/feedback")
      .then((resp: any) => {
        // If response is an array, use it directly
        const feedbacksData = Array.isArray(resp) ? resp : (resp.contents || []);
        setAllFeedbacks(feedbacksData);
        setFilteredFeedbacks(feedbacksData);
      })
      .catch(error => {
        console.error(`Failed to fetch feedbacks:`, error);
      })
      .finally(() => setIsLoading(false));
  };

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Apply filters based on selected status
  const applyFilters = () => {
    if (statusFilter === "all") {
      setFilteredFeedbacks([...allFeedbacks]);
    } else {
      const filtered = allFeedbacks.filter(feedback =>
        feedback.statusDTO.id == statusFilter
      );
      setFilteredFeedbacks(filtered);
    }
    setCurrentPage(0); // Reset to first page when filters change
  };

  const clearSearch = () => {
    setSearchValue("");
    applyFilters();
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const getFormattedDate = (dateStr: any) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openFeedbackDialog = (feedback?: any) => {
    setSelectedFeedback(null);

    if (feedback) {
      setTimeout(() => {
        setSelectedFeedback(feedback);
        setIsFeedbackDialogOpen(true);
      }, 0);
    } else {
      setIsFeedbackDialogOpen(true);
    }
  };

  const closeFeedbackDialog = () => {
    setIsFeedbackDialogOpen(false);
    setTimeout(() => {
      setSelectedFeedback(null);
    }, 300);
  };

  // Get feedback status class based on status
  const getStatusClass = (status: any) => {
    switch (status) {
      case 4:
        return "border-yellow-500 text-yellow-500";
      case 5:
        return "border-green-500 text-green-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  // Get feedback status label based on status
  const getStatusLabel = (status: any) => {
    switch (status) {
      case 4:
        return "PENDING";
      case 5:
        return "COMPLETED";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="flex flex-col mb-6">
        <h2 className="text-4xl font-bold text-dark dark:text-white mb-4">
          User Feedbacks
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search input with debounce */}
          <div className="flex-1 min-w-[300px] relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by email, subject or content..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Status filter dropdown */}
          <div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="all">All Status</option>
              <option value="4">Pending</option>
              <option value="5">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600"></div>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="border-none uppercase [&>th]:text-center">
                <TableHead className="min-w-[80px] !text-left">ID</TableHead>
                <TableHead className="min-w-[180px]">User Email</TableHead>
                <TableHead className="min-w-[200px]">Subject</TableHead>
                <TableHead className="min-w-[120px]">Received Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks
                  .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                  .map((feedback: any) => (
                    <TableRow
                      className="text-center text-base font-medium text-dark dark:text-white"
                      key={feedback.id}
                    >
                      <TableCell className="text-left text-green-light-1">
                        {feedback.id}
                      </TableCell>
                      <TableCell>
                        {feedback.email || "N/A"}
                      </TableCell>
                      <TableCell className="truncate max-w-[300px]">
                        {feedback.subject || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getFormattedDate(feedback.createdAt)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-4 py-2 border rounded-full text-xs font-medium ${getStatusClass(feedback.statusDTO.id)}`}
                        >
                          {getStatusLabel(feedback.statusDTO.id)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => openFeedbackDialog(feedback)}
                          className="px-2 py-2 flex gap-2 items-center justify-center bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors mx-auto"
                        >
                          <svg
                            width="18px"
                            height="18px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 8.0606 20.3364 6.5 19.2001L3 20L3.8 16.5C2.66361 14.9394 2 13.0325 2 11C2 6.02944 6.02944 2 11 2"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16.5 6H22M19.25 3.25V8.75"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {feedback.statusDTO.id === 4 ? "Reply" : "View"}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No feedbacks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination - always show if there are enough items */}
          {filteredFeedbacks.length > pageSize && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {Math.min(pageSize, filteredFeedbacks.length - currentPage * pageSize)} of {filteredFeedbacks.length} feedbacks
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(Math.ceil(filteredFeedbacks.length / pageSize))].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === index
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredFeedbacks.length / pageSize) - 1, currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredFeedbacks.length / pageSize) - 1}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedFeedback ? (
        <FeedbackDialogPanel
          key={selectedFeedback.id}
          isOpen={isFeedbackDialogOpen}
          onClose={() => {
            closeFeedbackDialog();
            fetchFeedbacks(); // Refresh data after closing dialog
          }}
          feedback={selectedFeedback}
        />
      ) : null}
    </div>
  );
}