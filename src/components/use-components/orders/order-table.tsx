import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "@/api-client/api-client";
import { OrderDialogPanel } from "@/components/use-components/orders/order-dialog-panel";
import { debounce } from "lodash";

export function OrderTable({ className }: { className?: string }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for all orders and filtered orders
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  // Add state for client-side pagination
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Number of orders per page

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventSearchValue, setEventSearchValue] = useState("");
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

      // Call backend search endpoint
      axiosClient.get(`/events/search?searchValue=${encodeURIComponent(searchText)}`)
        .then((resp: any) => {
          const searchResults = resp.contents || [];

          // Get event IDs from search results
          const eventIds = searchResults.map((event: any) => event.id);

          // Filter orders by those event IDs and current status filter
          let matchedOrders = allOrders.filter(order =>
            eventIds.includes(order.eventDTO?.id)
          );

          // Apply status filter if needed
          if (statusFilter !== "all") {
            matchedOrders = matchedOrders.filter(order =>
              order.statusDTO?.id.toString() === statusFilter
            );
          }

          setFilteredOrders(matchedOrders);
        })
        .catch(error => {
          console.error("Error searching events:", error);
          // In case of error, fall back to regular filter
          applyFilters();
        })
        .finally(() => {
          setIsSearching(false);
          setCurrentPage(0); // Reset to first page
        });
    }, 500), // 500ms debounce delay
    [allOrders, statusFilter]
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply status filter whenever it changes
  useEffect(() => {
    applyFilters();
  }, [allOrders, statusFilter]);

  const fetchOrders = () => {
    setIsLoading(true);
    axiosClient.get("/orders")
      .then((resp: any) => {
        // If response is an array, use it directly
        const ordersData = Array.isArray(resp) ? resp : (resp.contents || []);
        setAllOrders(ordersData);
        setFilteredOrders(ordersData);
      })
      .catch(error => console.error(`Failed to fetch orders:`, error))
      .finally(() => setIsLoading(false));
  };

  // Handle event search input change with debounce
  const handleEventSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEventSearchValue(value);
    debouncedSearch(value);
  };

  // Apply filters based on selected status
  const applyFilters = () => {
    if (statusFilter === "all") {
      setFilteredOrders([...allOrders]);
    } else {
      const filtered = allOrders.filter(order =>
        order.statusDTO?.id.toString() === statusFilter
      );
      setFilteredOrders(filtered);
    }
    setCurrentPage(0); // Reset to first page when filters change
  };

  const clearSearch = () => {
    setEventSearchValue("");
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

  const calculateTotalAmount = (order: any) => {
    if (!order.orderItemDTOs || order.orderItemDTOs.length === 0) return 0;

    let total;

    if (order.eventDTO.type === true) {
      total = order.orderItemDTOs.reduce((sum: number, item: any) => {
        return sum + (item.ticketDTO?.price || 0) * (item.quantity || 0);
      }, 0);
    } else {
      total = order.orderItemDTOs.reduce((sum: number, item: any) => {
        return sum + order.eventDTO.seatPrice;
      }, 0);
    }

    // Apply voucher discount if available
    if (order.voucherDTO && order.voucherDTO.value) {
      total = Math.max(0, total - order.voucherDTO.value);
    }
    return total;
  };

  const openOrderDialog = (order?: any) => {
    setSelectedOrder(null);

    if (order) {
      setTimeout(() => {
        setSelectedOrder(order);
        setIsOrderDialogOpen(true);
      }, 0);
    } else {
      setIsOrderDialogOpen(true);
    }
  };

  const closeOrderDialog = () => {
    setIsOrderDialogOpen(false);
    setTimeout(() => {
      setSelectedOrder(null);
    }, 300);
  };

  // Get order status class based on status id
  const getStatusClass = (statusId: number) => {
    switch (statusId) {
      case 4: // Pending
        return "border-yellow-500 text-yellow-500";
      case 5: // Completed
        return "border-green-500 text-green-500";
      case 6: // Cancelled
        return "border-red-500 text-red-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  // Get order status label based on status id
  const getStatusLabel = (statusId: number) => {
    switch (statusId) {
      case 4:
        return "PENDING";
      case 5:
        return "COMPLETED";
      case 6:
        return "CANCELLED";
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
          Orders
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          {/* Event search input with debounce */}
          <div className="flex-1 min-w-[300px] relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by event title..."
                value={eventSearchValue}
                onChange={handleEventSearchChange}
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

            {eventSearchValue && (
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
              <option value="6">Cancelled</option>
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
                <TableHead className="min-w-[120px] !text-left">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders
                  .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                  .map((order: any) => (
                    <TableRow
                      className="text-center text-base font-medium text-dark dark:text-white"
                      key={order.id}
                    >
                      <TableCell className="text-left text-green-light-1">
                        {order.id}
                      </TableCell>
                      <TableCell>
                        {order.userDTO?.email || order.emailReceive || "N/A"}
                      </TableCell>
                      <TableCell>
                        {order.eventDTO?.title || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getFormattedDate(order.orderDate)}
                      </TableCell>
                      <TableCell>
                        ${calculateTotalAmount(order)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-4 py-2 border rounded-full text-xs font-medium ${getStatusClass(order.statusDTO?.id)}`}
                        >
                          {getStatusLabel(order.statusDTO?.id)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => openOrderDialog(order)}
                          className="px-2 py-2 flex gap-2 items-center justify-center bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors mx-auto"
                        >
                          <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z"
                              stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                              d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.47003 3.71997 5.18003 5.79997 2.89003 9.39997C1.99003 10.81 1.99003 13.18 2.89003 14.59C5.18003 18.19 8.47003 20.27 12 20.27Z"
                              stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination - always show if there are enough items */}
          {filteredOrders.length > pageSize && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {Math.min(pageSize, filteredOrders.length - currentPage * pageSize)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(Math.ceil(filteredOrders.length / pageSize))].map((_, index) => (
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
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredOrders.length / pageSize) - 1, currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredOrders.length / pageSize) - 1}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedOrder ? (
        <OrderDialogPanel
          key={selectedOrder.id}
          isOpen={isOrderDialogOpen}
          onClose={() => {
            closeOrderDialog();
            fetchOrders(); // Refresh data after closing dialog
          }}
          order={selectedOrder}
          type="edit"
        />
      ) : (
        <OrderDialogPanel
          isOpen={isOrderDialogOpen}
          onClose={() => {
            closeOrderDialog();
            fetchOrders(); // Refresh data after closing dialog
          }}
          type="create"
        />
      )}
    </div>
  );
}