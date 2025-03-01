import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import axiosClient from "@/api-client/api-client";
import { EventDialogPanel } from "@/components/use-components/events/event-dialog-panel";

export function EventTable({ className }: { className?: string }) {
  const [events, setEvents] = useState<any>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add state for pagination and filtering
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12; // Page size configured in BE
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", or "ended"

  useEffect(() => {
    fetchEvents();
  }, [currentPage, statusFilter]); // Add statusFilter as dependency

  const fetchEvents = () => {
    setIsLoading(true);

    let endpoint = '/events';
    if (statusFilter === 'active') {
      endpoint = '/events/active';
    } else if (statusFilter === 'ended') {
      endpoint = '/events/ended';
    }

    axiosClient.get(`${endpoint}?no=${currentPage}&limit=${pageSize}`)
      .then((resp: any) => {
        setEvents(resp.contents);
        // If API returns pagination info, update state
        if (resp.totalPages) setTotalPages(resp.totalPages);
        if (resp.totalItems) setTotalItems(resp.totalItems);
      })
      .catch(error => console.error(`Failed to fetch events:`, error))
      .finally(() => setIsLoading(false));
  };

  // Handle filter change
  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(0); // Reset to first page when filter changes
    // No need to call fetchEvents here, it will be triggered by useEffect
  };

  const getRealDate = (dateStr: any) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openEventDialog = (event?: any) => {
    setSelectedEvent(null);

    if (event) {
      setTimeout(() => {
        setSelectedEvent(event);
        setIsEventDialogOpen(true);
      }, 0);
    } else {
      setIsEventDialogOpen(true);
    }
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };

  // Fixed to not use handleEventUpdated anymore

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold text-dark dark:text-white">
          Events
        </h2>
        <div className="flex items-center gap-4">
          {/* Status filter dropdown */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active Events</option>
            <option value="ended">Ended Events</option>
          </select>

          <button
            onClick={() => openEventDialog()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20"
                 fill="currentColor">
              <path fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd" />
            </svg>
            ADD NEW EVENT
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
                <TableHead className="min-w-[120px] !text-left">Title</TableHead>
                <TableHead>Venue Name</TableHead>
                <TableHead>Full Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Organiser</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {events.length > 0 ? (
                events.map((event: any) => (
                  <TableRow
                    className="text-center text-base font-medium text-dark dark:text-white"
                    key={event.id}
                  >
                    <TableCell className="text-left gap-3 text-green-light-1">
                      {event.title}
                    </TableCell>
                    <TableCell>
                      {event.venueName}
                    </TableCell>
                    <TableCell>
                      {event.locationAddress + ", " + event.locationWard + ", " + event.locationDistrict + ", " + event.locationProvince}
                    </TableCell>
                    <TableCell>
                      {event.type === false ? (<span className="text-blue-dark">SEAT</span>) : (
                        <span className="text-green-dark">TICKET</span>)}
                    </TableCell>
                    <TableCell>{event.organiserDTO.name}</TableCell>
                    <TableCell>{getRealDate(event.startedAt)}</TableCell>
                    <TableCell>{event.statusDTO.id === 1 ? (
                      <span className="px-4 py-2 border border-green-500 text-green-500 rounded-full text-xs font-medium">
                        ACTIVE
                      </span>
                    ) : event.statusDTO.id === 2 ? (
                      <span className="px-2 py-1 border border-red-500 text-red-500 rounded-full text-xs font-medium">
                        ENDED
                      </span>
                    ) : (
                      <span className="px-2 py-1 border border-red-500 text-red-500 rounded-full text-xs font-medium">
                      </span>
                    )}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => openEventDialog(event)}
                        className="px-2 py-2 flex gap-2 items-center bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {events.length} of {totalItems} events
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
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

      {selectedEvent ? (
        <EventDialogPanel
          key={selectedEvent.id}
          isOpen={isEventDialogOpen}
          onClose={() => {
            closeEventDialog();
            fetchEvents(); // Refresh data after closing dialog
          }}
          event={selectedEvent}
          type="edit"
        />
      ): (
        <EventDialogPanel
          isOpen={isEventDialogOpen}
          onClose={() => {
            closeEventDialog();
            fetchEvents(); // Refresh data after closing dialog
          }}
          type="create"
        />
      )}
    </div>
  );
}