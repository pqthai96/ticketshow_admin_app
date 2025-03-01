"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ImagePreview } from "@/components/image-preview";
import AddressSelector, { AddressInfo } from "@/components/address-selector";

export function UserDialogPanel({ isOpen, onClose, user, type }: {
  isOpen: boolean,
  onClose: () => void,
  user?: any,
  type: string
}) {
  // Form validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User form states
  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [gender, setGender] = useState<string>(
    user?.gender === true ? "male" : user?.gender === false ? "female" : "male"
  );
  const [dayOfBirth, setDayOfBirth] = useState<string>(
    user?.dayOfBirth ? new Date(user.dayOfBirth).toISOString().split("T")[0] : ""
  );
  const [isVerified, setIsVerified] = useState<boolean>(user?.isVerified || false);

  // Address states
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [address, setAddress] = useState<string>(user?.address || "");

  // Avatar image states
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [avatarImagePreview, setAvatarImagePreview] = useState(user?.avatarImagePath || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Reset state when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setPassword("");
      setConfirmPassword("");
      setGender(user.gender === true ? "male" : "female");
      setDayOfBirth(user.dayOfBirth ? new Date(user.dayOfBirth).toISOString().split("T")[0] : "");
      setAddress(user.address || "");
      setIsVerified(user.isVerified || false);
      setAvatarImagePreview(user.avatarImagePath || "");

      // Set address info if available
      if (user.province || user.district || user.ward) {
        setAddressInfo({
          province_id: "", // These IDs might not be available, but we need to set the names
          province_name: user.province || "",
          district_id: "",
          district_name: user.district || "",
          ward_id: "",
          ward_name: user.ward || ""
        });
      }

      setErrors({});
      setIsLoading(false);
    }
  }, [user]);

  // Handle form field changes
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    if (errors.firstName) {
      setErrors(prev => ({ ...prev, firstName: "" }));
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    if (errors.lastName) {
      setErrors(prev => ({ ...prev, lastName: "" }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
  };

  const handleDayOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDayOfBirth(e.target.value);
    if (errors.dayOfBirth) {
      setErrors(prev => ({ ...prev, dayOfBirth: "" }));
    }
  };

  const handleIsVerifiedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsVerified(e.target.checked);
  };

  // Handle address change from AddressSelector
  const handleAddressChange = (newAddressInfo: AddressInfo) => {
    setAddressInfo(newAddressInfo);

    // Clear address-related errors when address is updated
    const newErrors = { ...errors };
    delete newErrors.province;
    delete newErrors.district;
    delete newErrors.ward;
    setErrors(newErrors);
  };

  // Handler for address details
  const handleAddressDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);

    // Clear error for address detail
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: "" }));
    }
  };

  // Handle file selection for avatar
  const handleAvatarImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarImage(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarImagePreview(imageUrl);

      // Clear any previous error for avatar image
      setErrors(prev => ({ ...prev, avatarImage: "" }));
    }
  };

  // Handle avatar image upload
  const handleAvatarImageUpload = async () => {
    if (!avatarImage) {
      setErrors(prev => ({ ...prev, avatarImage: "Please select an image to upload" }));
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Here you would upload the image to your server
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Avatar image uploaded successfully");

      // Clear error if any
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.avatarImage;
        return newErrors;
      });
    } catch (error) {
      console.error("Error uploading avatar image:", error);
      setErrors(prev => ({ ...prev, avatarImage: "Failed to upload image. Please try again." }));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate basic user info
    if (!firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{9,15}$/.test(phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation for new users or password changes
    if (type === "edit" && password) {
      if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Validate birth date
    if (dayOfBirth) {
      const birthDate = new Date(dayOfBirth);
      const today = new Date();

      if (birthDate > today) {
        newErrors.dayOfBirth = "Birth date cannot be in the future";
      }

      // Check if user is at least 13 years old
      const thirteenYearsAgo = new Date();
      thirteenYearsAgo.setFullYear(today.getFullYear() - 13);

      if (birthDate > thirteenYearsAgo) {
        newErrors.dayOfBirth = "User must be at least 13 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async () => {
    // Validate form data
    if (!validateForm()) {
      return;
    }

    // Show submitting state
    setIsSubmitting(true);

    try {
      // Prepare user data for submission
      const userData = {
        id: user?.id,
        firstName,
        lastName,
        email,
        phone,
        password: password || undefined, // Only include if provided
        gender: gender === "male",
        dayOfBirth: dayOfBirth ? new Date(dayOfBirth).toISOString() : null,
        isVerified,
        statusDTO: user?.statusDTO || { id: 1, name: "ACTIVE" }, // Default to active if not provided
        province: addressInfo?.province_name || user?.province,
        district: addressInfo?.district_name || user?.district,
        ward: addressInfo?.ward_name || user?.ward,
        address,
        avatarImagePath: avatarImagePreview
      };

      console.log("Updating user:", userData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, you would make an API call here
      // const endpoint = `/users/${user.id}`;
      // await axiosClient.put(endpoint, userData);

      onClose(); // Close the dialog on success
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors(prev => ({ ...prev, submit: "Failed to update user. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to display field error
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  return (
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
                  USER EDIT INFORMATION
                  {user && (<span className="text-green-dark"> - {user.firstName} {user.lastName}</span>)}
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

                    {/* Avatar Image Upload - Separate from main form */}
                    <div className="mb-4.5">
                      <div className="w-full border-2 p-3 rounded-xl">
                        <label className="text-body-sm font-medium text-dark dark:text-white">User Avatar</label>
                        <div className="flex items-center mt-2">
                          {avatarImagePreview && (
                            <div className="mr-4">
                              <ImagePreview
                                src={avatarImagePreview.startsWith("blob:")
                                  ? avatarImagePreview
                                  : `${process.env.NEXT_PUBLIC_API_URL}${avatarImagePreview}`}
                                altText="Avatar Preview"
                                className="w-20 h-20 rounded-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <InputGroup
                              name="avatarImage"
                              type="file"
                              fileStyleVariant="style1"
                              placeholder="Upload avatar image"
                              className="w-full"
                              onChange={handleAvatarImageChange}
                            />
                            {getFieldError("avatarImage")}
                          </div>
                          <button
                            type="button"
                            className={`ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary ${
                              isUploadingAvatar ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
                            } focus:outline-none`}
                            onClick={handleAvatarImageUpload}
                            disabled={isUploadingAvatar || !avatarImage}
                          >
                            {isUploadingAvatar ? (
                              <>
                                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                                Uploading...
                              </>
                            ) : (
                              "UPLOAD"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Form */}
                    <form id="userForm">
                      {/* Basic User Info */}
                      <div className="mb-4.5 grid grid-cols-1 gap-4.5 md:grid-cols-2">
                        <div>
                          <InputGroup
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={handleFirstNameChange}
                          />
                          {getFieldError("firstName")}
                        </div>
                        <div>
                          <InputGroup
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={handleLastNameChange}
                          />
                          {getFieldError("lastName")}
                        </div>
                      </div>

                      <div className="mb-4.5 grid grid-cols-1 gap-4.5 md:grid-cols-2">
                        <div>
                          <InputGroup
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={handleEmailChange}
                          />
                          {getFieldError("email")}
                        </div>
                        <div>
                          <InputGroup
                            label="Phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={handlePhoneChange}
                          />
                          {getFieldError("phone")}
                        </div>
                      </div>

                      {/* Password Fields - Only show in edit mode if user wants to change password */}
                      <div className="mb-4.5 grid grid-cols-1 gap-4.5 md:grid-cols-2">
                        <div>
                          <InputGroup
                            label="Password (leave blank to keep current)"
                            name="password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={handlePasswordChange}
                          />
                          {getFieldError("password")}
                        </div>
                        <div>
                          <InputGroup
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                          />
                          {getFieldError("confirmPassword")}
                        </div>
                      </div>

                      {/* Gender, Date of Birth, and Verification Status */}
                      <div className="mb-4.5 grid grid-cols-1 gap-4.5 md:grid-cols-3">
                        <div>
                          {/* Gender Radio Buttons */}
                          <label className="block text-body-sm font-medium text-dark mb-2.5">Gender</label>
                          <div className="flex space-x-6">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === "male"}
                                onChange={handleGenderChange}
                                className="mr-2 accent-primary"
                              />
                              <span>Male</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === "female"}
                                onChange={handleGenderChange}
                                className="mr-2 accent-primary"
                              />
                              <span>Female</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <InputGroup
                            label="Date of Birth"
                            name="dayOfBirth"
                            type="date"
                            value={dayOfBirth}
                            onChange={handleDayOfBirthChange}
                           placeholder={""}/>
                          {getFieldError("dayOfBirth")}
                        </div>

                        <div>
                          {/* Verification Status */}
                          <label className="block text-body-sm font-medium text-dark mb-2.5">Verification Status</label>
                          <div className="flex items-center h-11 px-4 border border-gray-300 rounded">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name="isVerified"
                                checked={isVerified}
                                onChange={handleIsVerifiedChange}
                                className="mr-2 accent-primary h-5 w-5"
                              />
                              <span>User is verified</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* User Status */}
                      <div className="mb-4.5">
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
                              label: "Inactive",
                              value: "2"
                            }
                          ]}
                          defaultValue={user?.statusDTO?.id}
                        />
                      </div>

                      {/* Address Selector */}
                      <div className="mb-4.5">
                        <label className="block text-body-sm font-medium text-dark mb-2.5">Address</label>
                        <AddressSelector
                          initialProvince={user?.province}
                          initialDistrict={user?.district}
                          initialWard={user?.ward}
                          onAddressChange={handleAddressChange}
                        />
                        {(errors.province || errors.district || errors.ward) && (
                          <div className="mt-1 text-red-500 text-sm">
                            {errors.province && <p>{errors.province}</p>}
                            {errors.district && <p>{errors.district}</p>}
                            {errors.ward && <p>{errors.ward}</p>}
                          </div>
                        )}
                      </div>

                      {/* Address Details */}
                      <div className="mb-4.5">
                        <InputGroup
                          label="Address Details"
                          name="addressDetail"
                          type="text"
                          placeholder="Enter detailed address"
                          value={address}
                          onChange={handleAddressDetailChange}
                        />
                        {getFieldError("address")}
                      </div>
                    </form>
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
  );
}