import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import axiosClient from "@/api-client/api-client";
import { VoucherDialogPanel } from "@/components/use-components/vouchers/voucher-dialog-panel";
import { format } from "date-fns";

export function VoucherTable({ className }: { className?: string }) {
  const [allVouchers, setAllVouchers] = useState<any[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<any[]>([]);
  const [displayedVouchers, setDisplayedVouchers] = useState<any[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Number of items per page
  const [totalPages, setTotalPages] = useState(1);

  // Add state for filtering
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Apply filters whenever filter state or all vouchers change
  useEffect(() => {
    applyFilters();
  }, [statusFilter, allVouchers]);

  // Update displayed vouchers when filtered vouchers or pagination changes
  useEffect(() => {
    updateDisplayedVouchers();
  }, [filteredVouchers, currentPage]);

  const fetchVouchers = () => {
    setIsLoading(true);

    axiosClient.get('/voucher')
      .then((resp: any) => {
        // Store all vouchers
        const voucherData = Array.isArray(resp) ? resp : resp.contents || [];
        setAllVouchers(voucherData);
      })
      .catch(error => console.error(`Failed to fetch vouchers:`, error))
      .finally(() => setIsLoading(false));
  };

  // Apply filters to the vouchers
  const applyFilters = () => {
    const now = new Date();
    let filtered = [...allVouchers];

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(voucher => {
        const startDate = new Date(voucher.startedAt);
        const endDate = new Date(voucher.endedAt);
        return startDate <= now && now <= endDate;
      });
    } else if (statusFilter === 'upcoming') {
      filtered = filtered.filter(voucher => {
        const startDate = new Date(voucher.startedAt);
        return startDate > now;
      });
    } else if (statusFilter === 'expired') {
      filtered = filtered.filter(voucher => {
        const endDate = new Date(voucher.endedAt);
        return endDate < now;
      });
    }

    setFilteredVouchers(filtered);

    // Update total pages
    setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));

    // Reset to first page when filter changes
    if (currentPage >= Math.ceil(filtered.length / pageSize)) {
      setCurrentPage(0);
    }
  };

  // Update the displayed vouchers based on current page
  const updateDisplayedVouchers = () => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedVouchers(filteredVouchers.slice(startIndex, endIndex));
  };

  // Format date to display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Handle filter change
  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const openVoucherDialog = (voucher?: any) => {
    setSelectedVoucher(null);

    if (voucher) {
      setTimeout(() => {
        setSelectedVoucher(voucher);
        setIsVoucherDialogOpen(true);
      }, 0);
    } else {
      setIsVoucherDialogOpen(true);
    }
  };

  const closeVoucherDialog = () => {
    setIsVoucherDialogOpen(false);
    setTimeout(() => {
      setSelectedVoucher(null);
    }, 300);
  };

  // Check if voucher is active based on dates
  const getVoucherStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "upcoming";
    } else if (now > end) {
      return "expired";
    } else {
      return "active";
    }
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold text-dark dark:text-white">
          Vouchers
        </h2>
        <div className="flex items-center gap-4">
          {/* Status filter dropdown */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">All Vouchers</option>
            <option value="active">Active Vouchers</option>
            <option value="upcoming">Upcoming Vouchers</option>
            <option value="expired">Expired Vouchers</option>
          </select>

          <button
            onClick={() => openVoucherDialog()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20"
                 fill="currentColor">
              <path fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd" />
            </svg>
            ADD NEW VOUCHER
          </button>
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
                <TableHead className="w-1/6 !text-left">Code</TableHead>
                <TableHead className="w-1/6">Name</TableHead>
                <TableHead className="w-1/6">Value</TableHead>
                <TableHead className="w-1/6">Min. Order</TableHead>
                <TableHead className="w-1/5">Validity Period</TableHead>
                <TableHead className="w-1/10">Status</TableHead>
                <TableHead className="w-1/10">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {displayedVouchers.length > 0 ? (
                displayedVouchers.map((voucher: any) => {
                  const status = getVoucherStatus(voucher.startedAt, voucher.endedAt);

                  return (
                    <TableRow
                      className="text-center text-base font-medium text-dark dark:text-white"
                      key={voucher.id}
                    >
                      <TableCell className="text-left font-mono text-green-dark">
                        {voucher.code}
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-xs mx-auto">
                          {voucher.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        ${voucher.value.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${voucher.minOrderTotal.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {formatDate(voucher.startedAt)} - {formatDate(voucher.endedAt)}
                      </TableCell>
                      <TableCell>
                        {status === "active" ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Active
                          </span>
                        ) : status === "upcoming" ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Upcoming
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Expired
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => openVoucherDialog(voucher)}
                          className="px-2 py-2 flex gap-2 items-center justify-center bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors mx-auto"
                        >
                          <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z"
                              stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 21H12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round" />
                          </svg>
                          Edit
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No vouchers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {displayedVouchers.length} of {filteredVouchers.length} vouchers
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  // Show at most 5 page buttons
                  let pageNumber = currentPage;
                  if (totalPages <= 5) {
                    pageNumber = index;
                  } else if (currentPage < 3) {
                    pageNumber = index;
                  } else if (currentPage > totalPages - 3) {
                    pageNumber = totalPages - 5 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === pageNumber
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedVoucher ? (
        <VoucherDialogPanel
          key={selectedVoucher.id}
          isOpen={isVoucherDialogOpen}
          onClose={() => {
            closeVoucherDialog();
            fetchVouchers(); // Refresh data after closing dialog
          }}
          voucher={selectedVoucher}
          type="edit"
        />
      ): (
        <VoucherDialogPanel
          isOpen={isVoucherDialogOpen}
          onClose={() => {
            closeVoucherDialog();
            fetchVouchers(); // Refresh data after closing dialog
          }}
          type="create"
        />
      )}
    </div>
  );
}