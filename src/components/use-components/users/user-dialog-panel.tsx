import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Select } from "@/components/FormElements/select";
import Image from "next/image";

export function UserDialogPanel({ isOpen, onClose, user, type }: {
  isOpen: boolean,
  onClose: () => void,
  user?: any,
  type: string
}) {
  // Main states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [userStatus, setUserStatus] = useState<string>("1");

  // Initialize or reset state when user changes
  useEffect(() => {
    if (user) {
      setUserStatus(user.statusDTO?.id.toString() || "1");
      setErrors({});
      setIsLoading(false);
    }
  }, [user]);

  // Status change handler
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserStatus(e.target.value);
  };

  // API interaction handlers
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userData = {
        id: user?.id,
        statusDTO: {
          id: parseInt(userStatus),
          name: userStatus === "1" ? "ACTIVE" : "DELETED"
        }
      };

      console.log("Updating user status:", userData);

      // Actual API call - uncomment for production
      // await axiosClient.put(`/user/${user.id}`, userData);

      // For demo purposes - simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onClose(); // Close dialog on success
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors({ submit: "Failed to update user. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      const resetData = {
        id: user?.id,
        password: newPassword
      };

      console.log("Resetting password for user:", user?.id);

      // Actual API call - uncomment for production
      // await axiosClient.post(`/user/${user.id}/reset-password`, resetData);

      // For demo purposes - simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      return Promise.resolve();
    } catch (error) {
      console.error("Error resetting password:", error);
      return Promise.reject(error);
    }
  };

  // Helper functions
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const getFullName = (user: any) => {
    if (!user) return "N/A";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";
  };

  const getFullAddress = (user: any) => {
    if (!user) return "N/A";

    const addressParts = [
      user.address,
      user.ward,
      user.district,
      user.province
    ].filter(part => part && part.trim() !== "");

    return addressParts.length > 0 ? addressParts.join(", ") : "N/A";
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  // Component rendering
  return (
    <>
      {/* Main User Information Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-[80vw] max-h-[90vh] bg-white rounded-2xl pt-6 pl-6 pb-2 pr-6 shadow-xl relative flex flex-col">
                {/* Header with title */}
                <div className="flex items-center mb-6 pr-10">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    USER INFORMATION
                    {user && (<span className="text-green-dark"> - {getFullName(user)}</span>)}
                  </Dialog.Title>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
                  disabled={isSubmitting}
                >
                  <svg width="24px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor"
                          d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z" />
                  </svg>
                </button>

                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600"></div>
                    <span className="ml-3">Loading user data...</span>
                  </div>
                ) : (
                  <>
                    {/* Scrollable content area with more bottom padding for button */}
                    <div className="flex-1 overflow-y-auto pr-4 pb-20">
                      {errors.submit && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                          {errors.submit}
                        </div>
                      )}

                      {/* User Avatar Display & Password Reset Button */}
                      {user && (
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-6">
                              {user.avatarImagePath ? (
                                <Image
                                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                  src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatarImagePath}`}
                                  width={96}
                                  height={96}
                                  quality={100}
                                  alt="user avatar"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-3xl text-gray-500">
                                    {user.firstName && user.firstName.charAt(0)}
                                    {user.lastName && user.lastName.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-2xl font-semibold">{getFullName(user)}</h3>
                              <p className="text-gray-600">{user?.email || "No email"}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* User Information Sections */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Basic Information */}
                        <div className="border rounded-lg p-4">
                          <h4 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h4>

                          <div className="space-y-3">
                            <div className="grid grid-cols-2">
                              <span className="text-gray-500">Full Name:</span>
                              <span>{getFullName(user)}</span>
                            </div>

                            <div className="grid grid-cols-2">
                              <span className="text-gray-500">Email:</span>
                              <span>{user?.email || "N/A"}</span>
                            </div>

                            <div className="grid grid-cols-2">
                              <span className="text-gray-500">Gender:</span>
                              <span>{user?.gender === true ? "Male" : "Female"}</span>
                            </div>

                            <div className="grid grid-cols-2">
                              <span className="text-gray-500">Date of Birth:</span>
                              <span>{formatDate(user?.dayOfBirth)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Address & Account Information */}
                        <div className="border rounded-lg p-4">
                          <h4 className="text-lg font-semibold mb-4 border-b pb-2">Account Information</h4>

                          <div className="space-y-3 mb-4">
                            <div className="grid grid-cols-2">
                              <span className="text-gray-500">Full Address:</span>
                              <span>{getFullAddress(user)}</span>
                            </div>

                            <div className="grid grid-cols-2">
                              <span className="text-gray-500">Verification:</span>
                              <span>
                                {user?.verified ? (
                                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    Unverified
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Editable Section - User Status */}
                      <div className="border rounded-lg p-4 mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">Status Management</h4>

                        <div className="mb-4">
                          <Select
                            label="User Status"
                            name="userStatus"
                            placeholder="Select status"
                            className="w-full"
                            items={[
                              {
                                label: "Active",
                                value: "1"
                              },
                              {
                                label: "Deleted",
                                value: "2"
                              }
                            ]}
                            defaultValue={userStatus}
                            onChange={handleStatusChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fixed button at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-white shadow-md border-t">
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={onClose}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          className={`px-6 py-2 rounded-md text-white bg-primary ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
                          }`}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full inline-block"></span>
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}