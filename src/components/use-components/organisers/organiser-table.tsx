import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import axiosClient from "@/api-client/api-client";
import { OrganiserDialogPanel } from "@/components/use-components/organisers/organiser-dialog";

export function OrganiserTable({ className }: { className?: string }) {
  const [organisers, setOrganisers] = useState<any>([]);
  const [selectedOrganiser, setSelectedOrganiser] = useState<any>(null);
  const [isOrganiserDialogOpen, setIsOrganiserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add state for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12; // Page size configured in BE

  useEffect(() => {
    fetchOrganisers();
  }, [currentPage]);

  const fetchOrganisers = () => {
    setIsLoading(true);

    axiosClient.get(`/organiser?no=${currentPage}&limit=${pageSize}`)
      .then((resp: any) => {
        setOrganisers(resp.contents || resp);
        // If API returns pagination info, update state
        if (resp.totalPages) setTotalPages(resp.totalPages);
        if (resp.totalItems) setTotalItems(resp.totalItems);
      })
      .catch(error => console.error(`Failed to fetch organisers:`, error))
      .finally(() => setIsLoading(false));
  };

  const openOrganiserDialog = (organiser?: any) => {
    setSelectedOrganiser(null);

    if (organiser) {
      setTimeout(() => {
        setSelectedOrganiser(organiser);
        setIsOrganiserDialogOpen(true);
      }, 0);
    } else {
      setIsOrganiserDialogOpen(true);
    }
  };

  const closeOrganiserDialog = () => {
    setIsOrganiserDialogOpen(false);
    setTimeout(() => {
      setSelectedOrganiser(null);
    }, 300);
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
          Organisers
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => openOrganiserDialog()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20"
                 fill="currentColor">
              <path fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd" />
            </svg>
            ADD NEW ORGANISER
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
                <TableHead className="w-1/4 !text-left">Name</TableHead>
                <TableHead className="w-2/4">Description</TableHead>
                <TableHead className="w-1/4">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {organisers.length > 0 ? (
                organisers.map((organiser: any) => (
                  <TableRow
                    className="text-center text-base font-medium text-dark dark:text-white"
                    key={organiser.id}
                  >
                    <TableCell className="text-left text-green-light-1">
                      <div className="flex items-center gap-3 truncate">
                        {organiser.avatarImagePath && (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${organiser.avatarImagePath}`}
                            alt={organiser.name}
                            className="w-10 h-10 min-w-10 rounded-full object-cover"
                          />
                        )}
                        <span className="truncate">{organiser.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate text-left">{organiser.description || "No description available"}</p>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => openOrganiserDialog(organiser)}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10">
                    No organisers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {organisers.length} of {totalItems} organisers
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

      {selectedOrganiser ? (
        <OrganiserDialogPanel
          key={selectedOrganiser.id}
          isOpen={isOrganiserDialogOpen}
          onClose={() => {
            closeOrganiserDialog();
            fetchOrganisers(); // Refresh data after closing dialog
          }}
          organiser={selectedOrganiser}
          type="edit"
        />
      ): (
        <OrganiserDialogPanel
          isOpen={isOrganiserDialogOpen}
          onClose={() => {
            closeOrganiserDialog();
            fetchOrganisers(); // Refresh data after closing dialog
          }}
          type="create"
        />
      )}
    </div>
  );
}