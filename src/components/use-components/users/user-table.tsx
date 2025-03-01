import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import axiosClient from "@/api-client/api-client";
import { UserDialogPanel } from "@/components/use-components/users/user-dialog-panel";

export function UserTable({ className }: { className?: string }) {
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for all users and filtered users
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // Add state for client-side pagination
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Number of users per page
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", or "inactive"
  const [verificationFilter, setVerificationFilter] = useState("all"); // "all", "verified", or "unverified"

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [allUsers, statusFilter, verificationFilter]);

  const fetchUsers = () => {
    setIsLoading(true);
    axiosClient.get("/user")
      .then((resp: any) => {
        // If response is an array, use it directly
        const usersData = Array.isArray(resp) ? resp : (resp.contents || []);
        setAllUsers(usersData);
        setFilteredUsers(usersData);
      })
      .catch(error => console.error(`Failed to fetch users:`, error))
      .finally(() => setIsLoading(false));
  };

  // Filter users based on selected filters
  const applyFilters = () => {
    let result = [...allUsers];

    // Apply status filter
    if (statusFilter === "active") {
      result = result.filter(user => user.statusDTO?.id === 1);
    } else if (statusFilter === "inactive") {
      result = result.filter(user => user.statusDTO?.id !== 1);
    }

    // Apply verification filter
    if (verificationFilter === "verified") {
      result = result.filter(user => user.isVerified === true);
    } else if (verificationFilter === "unverified") {
      result = result.filter(user => user.isVerified === false);
    }

    setFilteredUsers(result);
    setCurrentPage(0); // Reset to first page when filters change
  };

  // Handle filter changes
  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
  };

  const handleVerificationFilterChange = (newVerification: string) => {
    setVerificationFilter(newVerification);
  };

  const getFormattedDate = (dateStr: any) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openUserDialog = (user?: any) => {
    setSelectedUser(null);

    if (user) {
      setTimeout(() => {
        setSelectedUser(user);
        setIsUserDialogOpen(true);
      }, 0);
    } else {
      setIsUserDialogOpen(true);
    }
  };

  const closeUserDialog = () => {
    setIsUserDialogOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  };

  const getFullName = (user: any) => {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";
  };

  const getFullAddress = (user: any) => {
    if (!user.address && !user.ward && !user.district && !user.province) {
      return "N/A";
    }

    const addressParts = [
      user.address,
      user.ward,
      user.district,
      user.province
    ].filter(part => part && part.trim() !== "");

    return addressParts.join(", ");
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
          Users
        </h2>
        <div className="flex items-center gap-4">
          {/* Status filter dropdown */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active Users</option>
            <option value="inactive">Deleted Users</option>
          </select>

          {/* Verification filter dropdown */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={verificationFilter}
            onChange={(e) => handleVerificationFilterChange(e.target.value)}
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
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
                <TableHead className="min-w-[120px] !text-left">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers
                  .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                  .map((user: any) => (
                    <TableRow
                      className="text-center text-base font-medium text-dark dark:text-white"
                      key={user.id}
                    >
                      <TableCell className="text-left gap-3 text-green-light-1">
                        {getFullName(user)}
                      </TableCell>
                      <TableCell>
                        {user.email || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getFullAddress(user)}
                      </TableCell>
                      <TableCell>
                        {user.gender === true ? "Male" : "Female"}
                      </TableCell>
                      <TableCell>
                        {getFormattedDate(user.dayOfBirth)}
                      </TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <span
                            className="px-4 py-2 border border-green-500 text-green-500 rounded-full text-xs font-medium">
                          VERIFIED
                        </span>
                        ) : (
                          <span
                            className="px-2 py-1 border border-yellow-500 text-yellow-500 rounded-full text-xs font-medium">
                          UNVERIFIED
                        </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.statusDTO?.id === 1 ? (
                          <span
                            className="px-4 py-2 border border-green-500 text-green-500 rounded-full text-xs font-medium">
                          ACTIVE
                        </span>
                        ) : (
                          <span
                            className="px-2 py-1 border border-red-500 text-red-500 rounded-full text-xs font-medium">
                          DELETED
                        </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => openUserDialog(user)}
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
                  <TableCell colSpan={9} className="text-center py-10">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination - always show if there are enough items */}
          {filteredUsers.length > pageSize && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {Math.min(pageSize, filteredUsers.length - currentPage * pageSize)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(Math.ceil(filteredUsers.length / pageSize))].map((_, index) => (
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
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredUsers.length / pageSize) - 1, currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredUsers.length / pageSize) - 1}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedUser ? (
        <UserDialogPanel
          key={selectedUser.id}
          isOpen={isUserDialogOpen}
          onClose={() => {
            closeUserDialog();
            fetchUsers(); // Refresh data after closing dialog
          }}
          user={selectedUser}
          type="edit"
        />
      ) : (
        <UserDialogPanel
          isOpen={isUserDialogOpen}
          onClose={() => {
            closeUserDialog();
            fetchUsers(); // Refresh data after closing dialog
          }}
          type="create"
        />
      )}
    </div>
  );
}