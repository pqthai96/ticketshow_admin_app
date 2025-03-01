"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import TextEditor from "@/components/text-editor";
import axiosClient from "@/api-client/api-client";
import { ImagePreview } from "@/components/image-preview";
import AddressSelector, { AddressInfo } from "@/components/address-selector";

export function EventDialogPanel({ isOpen, onClose, event, type }: {
  isOpen: boolean,
  onClose: () => void,
  event?: any,
  type: string
}) {
  // Form validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [contentData, setContentData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  // Default event type to "seat" for create mode, otherwise use event.type (true = ticket, false = seat)
  const [eventType, setEventType] = useState<string>(
    type === "create" ? "seat" : (event?.type ? "ticket" : "seat")
  );

  const [seatPrice, setSeatPrice] = useState<string>(event?.seatPrice?.toString() || "");
  const [bookedSeats, setBookedSeats] = useState<string>(event?.bookedSeats || "");

  // Address states
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [address, setAddress] = useState<string>(event?.locationAddress || "");
  const [venueName, setVenueName] = useState<string>(event?.venueName || "");

  // Image preview states
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [positionImage, setPositionImage] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(event?.bannerImagePath || "");
  const [positionImagePreview, setPositionImagePreview] = useState(event?.positionImagePath || "");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingPosition, setIsUploadingPosition] = useState(false);

  // Handle event type change
  const handleEventTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventType(e.target.value);

    // Clear related errors when event type changes
    const newErrors = { ...errors };
    if (e.target.value === "seat") {
      delete newErrors.positionImage;
      delete newErrors.tickets;
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith("ticket_")) {
          delete newErrors[key];
        }
      });
    } else {
      delete newErrors.seatPrice;
      delete newErrors.bookedSeats;
    }

    setErrors(newErrors);
  };

  // Handle seatPrice change
  const handleSeatPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeatPrice(e.target.value);

    if (errors.seatPrice) {
      setErrors(prev => ({ ...prev, seatPrice: "" }));
    }
  };

  // Handle bookedSeats change
  const handleBookedSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookedSeats(e.target.value);

    if (errors.bookedSeats) {
      setErrors(prev => ({ ...prev, bookedSeats: "" }));
    }
  };

  // Handle file selection for images
  const handleBannerImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      const imageUrl = URL.createObjectURL(file);
      setBannerImagePreview(imageUrl);

      // Clear any previous error for banner image
      setErrors(prev => ({ ...prev, bannerImage: "" }));
    }
  };

  const handlePositionImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPositionImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPositionImagePreview(imageUrl);

      // Clear any previous error for position image
      setErrors(prev => ({ ...prev, positionImage: "" }));
    }
  };

  // Handle image uploads separately
  const handleBannerImageUpload = async () => {
    if (!bannerImage) {
      setErrors(prev => ({ ...prev, bannerImage: "Please select an image to upload" }));
      return;
    }

    setIsUploadingBanner(true);
    try {
      // Here you would upload the image to your server
      // const formData = new FormData();
      // formData.append('bannerImage', bannerImage);
      // formData.append('eventId', event?.id); // If in edit mode

      // const response = await axiosClient.post('/events/upload-banner', formData);

      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If successful:
      console.log("Banner image uploaded successfully");
      // If you get a path back from the server:
      // setBannerImagePreview(response.data.path);

      // Clear error if any
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.bannerImage;
        return newErrors;
      });
    } catch (error) {
      console.error("Error uploading banner image:", error);
      setErrors(prev => ({ ...prev, bannerImage: "Failed to upload image. Please try again." }));
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handlePositionImageUpload = async () => {
    if (!positionImage) {
      setErrors(prev => ({ ...prev, positionImage: "Please select an image to upload" }));
      return;
    }

    setIsUploadingPosition(true);
    try {
      // Here you would upload the image to your server
      // const formData = new FormData();
      // formData.append('positionImage', positionImage);
      // formData.append('eventId', event?.id); // If in edit mode

      // const response = await axiosClient.post('/events/upload-position', formData);

      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If successful:
      console.log("Position image uploaded successfully");
      // If you get a path back from the server:
      // setPositionImagePreview(response.data.path);

      // Clear error if any
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.positionImage;
        return newErrors;
      });
    } catch (error) {
      console.error("Error uploading position image:", error);
      setErrors(prev => ({ ...prev, positionImage: "Failed to upload image. Please try again." }));
    } finally {
      setIsUploadingPosition(false);
    }
  };

  // Reset state when event changes
  useEffect(() => {
    if (event) {
      setContentData(event.content || "");
      setAddress(event?.locationAddress || "");
      setVenueName(event?.venueName || "");
      setSeatPrice(event?.seatPrice?.toString() || "");
      setBookedSeats(event?.bookedSeats || "");
      setEventType(event?.type ? "ticket" : "seat");
      setIsLoading(true);
      setErrors({});

      // Initialize tickets from event if available
      if (event.type === true) {
        axiosClient.get(`/ticket/event/${event.id}`).then((resp: any) => {
          setTickets(resp);
          setIsLoading(false);
        }).catch(error => {
          console.error("Error fetching tickets:", error);
          setIsLoading(false);
        });
      } else {
        // Initialize with empty ticket for create mode
        if (type === "create" && eventType === "ticket") {
          setTickets([{
            id: null,
            title: "",
            description: "",
            price: "",
            type: "",
            quantity: ""
          }]);
        } else {
          setTickets([]);
        }
        setIsLoading(false);
      }
    } else {
      // Set default for create mode
      if (type === "create") {
        setEventType("seat");
      }
    }
  }, [event, type]);

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

  // Handler venue name
  const handleVenueNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenueName(e.target.value);

    // Clear error for venue name
    if (errors.venueName) {
      setErrors(prev => ({ ...prev, venueName: "" }));
    }
  };

  // Ticket management functions
  const handleAddTicket = () => {
    setTickets([
      ...tickets,
      {
        id: null,
        title: "",
        description: "",
        price: "",
        type: "",
        quantity: ""
      }
    ]);
  };

  const handleRemoveTicket = (index: number) => {
    const updatedTickets = [...tickets];
    updatedTickets.splice(index, 1);
    setTickets(updatedTickets);
  };

  const handleTicketChange = (index: number, field: string, value: any) => {
    const updatedTickets = [...tickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: value
    };
    setTickets(updatedTickets);

    // Clear ticket-related errors when a ticket field is updated
    if (errors[`ticket_${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`ticket_${index}_${field}`];
      setErrors(newErrors);
    }
  };

  // Validate form fields
  const validateForm = (formData: any): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate basic event info
    if (!formData.title?.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.startedAt) {
      newErrors.startedAt = "Start date is required";
    }

    if (!formData.endedAt) {
      newErrors.endedAt = "End date is required";
    } else if (formData.startedAt && new Date(formData.startedAt) > new Date(formData.endedAt)) {
      newErrors.endedAt = "End date cannot be before start date";
    }

    // Validate address selection
    if (!addressInfo) {
      newErrors.address_selector = "Please select province, district and ward";
    } else {
      if (!addressInfo.province_id || !addressInfo.province_name) {
        newErrors.province = "Province is required";
      }

      if (!addressInfo.district_id || !addressInfo.district_name) {
        newErrors.district = "District is required";
      }

      if (!addressInfo.ward_id || !addressInfo.ward_name) {
        newErrors.ward = "Ward is required";
      }
    }

    // Validate address details
    if (!address?.trim()) {
      newErrors.address = "Address details are required";
    }

    // Validate venue
    if (!venueName?.trim()) {
      newErrors.venueName = "Venue name is required";
    }

    // Validate content
    if (!contentData?.trim()) {
      newErrors.content = "Event content is required";
    }

    // Banner image validation is handled separately in image upload

    // Validate event type specific fields
    if (eventType === "seat") {
      // Validate seat price
      if (!seatPrice || parseFloat(seatPrice) <= 0) {
        newErrors.seatPrice = "Valid seat price is required";
      }

      // Validate booked seats (optional validation)
      if (bookedSeats && !bookedSeats.trim().match(/^[A-Z0-9,\s]+$/)) {
        newErrors.bookedSeats = "Booked seats should be a comma-separated list";
      }
    } else {
      // Position image validation is handled separately in image upload

      // Validate each ticket
      tickets.forEach((ticket, index) => {
        if (!ticket.title?.trim()) {
          newErrors[`ticket_${index}_title`] = "Ticket title is required";
        }

        if (!ticket.price || parseFloat(ticket.price) <= 0) {
          newErrors[`ticket_${index}_price`] = "Valid ticket price is required";
        }

        if (!ticket.quantity || parseInt(ticket.quantity) <= 0) {
          newErrors[`ticket_${index}_quantity`] = "Valid ticket quantity is required";
        }
      });

      // Validate that there is at least one ticket for ticket events
      if (tickets.length === 0) {
        newErrors.tickets = "At least one ticket type is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async () => {
    // Check if image has been uploaded if this is create mode
    if (type === "create") {
      if (!bannerImagePreview) {
        setErrors(prev => ({ ...prev, bannerImage: "Banner image is required" }));
        return;
      }

      if (eventType === "ticket" && !positionImagePreview) {
        setErrors(prev => ({ ...prev, positionImage: "Position image is required for ticket events" }));
        return;
      }
    }

    // Get the form element
    const formElement = document.getElementById("eventForm") as HTMLFormElement;
    if (!formElement) {
      console.error("Form element not found");
      return;
    }

    // Collect form data
    const formData = {
      // Basic event info
      title: (formElement.querySelector("[name=\"title\"]") as HTMLInputElement)?.value,
      status: (formElement.querySelector("[name=\"status\"]") as HTMLSelectElement)?.value,
      startedAt: (formElement.querySelector("[name=\"startedAt\"]") as HTMLInputElement)?.value,
      endedAt: (formElement.querySelector("[name=\"endedAt\"]") as HTMLInputElement)?.value,
      // Address info from component
      locationProvince: addressInfo?.province_name,
      locationDistrict: addressInfo?.district_name,
      locationWard: addressInfo?.ward_name,
      locationAddress: address,
      // Venue info
      venueName: venueName,
      // Content
      content: contentData,
      // Event type
      type: eventType === "ticket",
      // Seat info
      seatPrice: eventType === "seat" ? parseFloat(seatPrice) : null,
      bookedSeats: eventType === "seat" ? bookedSeats : null,
      // Tickets
      tickets: eventType === "ticket" ? tickets : null,
      // Image paths
      bannerImagePath: bannerImagePreview,
      positionImagePath: eventType === "ticket" ? positionImagePreview : null
    };

    console.log(formData);

    // Validate form data
    if (!validateForm(formData)) {
      console.error("Form validation failed:", errors);
      return;
    }

    // Show submitting state
    setIsSubmitting(true);

    try {
      // TODO: Here you would submit the form data to your API
      // For example:
      // const formDataObj = new FormData();
      // for (const key in formData) {
      //   if (key !== 'tickets') { // Handle tickets separately
      //     formDataObj.append(key, formData[key]);
      //   }
      // }
      //
      // // Add tickets as JSON
      // if (formData.tickets) {
      //   formDataObj.append('tickets', JSON.stringify(formData.tickets));
      // }

      // const response = await axiosClient.post('/events', formDataObj);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Form submission successful:", formData);
      onClose(); // Close the dialog on success
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(prev => ({ ...prev, submit: "Failed to submit event. Please try again." }));
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
                  EVENT {type === "edit" ? "EDIT" : "CREATE"} INFORMATION
                  {event && (<span className="text-green-dark"> - {event.title}</span>)}
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
                  <span className="ml-3">Loading event data...</span>
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

                    {/* Banner Image Upload - Separate from main form */}
                    <div className="mb-4.5">
                      <div className="w-full border-2 p-3 rounded-xl">
                        <label className="text-body-sm font-medium text-dark dark:text-white">Banner Image</label>
                        {bannerImagePreview && (
                          <div className="mt-2 mb-3">
                            <ImagePreview
                              src={bannerImagePreview.startsWith("blob:")
                                ? bannerImagePreview
                                : `${process.env.NEXT_PUBLIC_API_URL}${bannerImagePreview}`}
                              altText="Banner Preview"
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-4.5 xl:flex-row">
                          <div className="w-full">
                            <InputGroup
                              name="bannerImage"
                              type="file"
                              fileStyleVariant="style1"
                              placeholder="Upload banner image"
                              className="w-full"
                              onChange={handleBannerImageChange}
                            />
                            {getFieldError("bannerImage")}
                          </div>
                          <button
                            type="button"
                            className={`inline-flex xl:w-1/4 items-center justify-center px-3 py-2 xl:mt-3 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary ${
                              isUploadingBanner ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
                            } focus:outline-none`}
                            onClick={handleBannerImageUpload}
                            disabled={isUploadingBanner || !bannerImage}
                          >
                            {isUploadingBanner ? (
                              <>
                              <span
                                className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
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
                    <form id="eventForm">
                      {/* Form content... */}
                      <form id="eventForm">
                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                          <div className="w-full">
                            <InputGroup
                              label="Title"
                              name="title"
                              type="text"
                              placeholder="Enter event's title"
                              className="w-full"
                              defaultValue={event?.title || ""}
                            />
                            {getFieldError("title")}
                          </div>

                          <Select
                            label="Status"
                            name="status"
                            placeholder="Select status"
                            className="w-full xl:w-1/4"
                            items={[
                              {
                                label: "Active",
                                value: "1"
                              },
                              {
                                label: "Ended",
                                value: "2"
                              }
                            ]}
                            defaultValue={event?.statusDTO?.id}
                          />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                          <div className="w-full xl:w-1/2">
                            <InputGroup
                              label="Started At"
                              name="startedAt"
                              type="date"
                              placeholder=""
                              className="w-full"
                              defaultValue={event?.startedAt ? new Date(event.startedAt).toISOString().split("T")[0] : ""}
                            />
                            {getFieldError("startedAt")}
                          </div>
                          <div className="w-full xl:w-1/2">
                            <InputGroup
                              label="Ended At"
                              name="endedAt"
                              type="date"
                              placeholder=""
                              className="w-full"
                              defaultValue={event?.endedAt ? new Date(event.endedAt).toISOString().split("T")[0] : ""}
                            />
                            {getFieldError("endedAt")}
                          </div>
                        </div>

                        {/* Address Selection */}
                        <div className="mb-2">
                          <AddressSelector
                            initialProvince={event?.locationProvince}
                            initialDistrict={event?.locationDistrict}
                            initialWard={event?.locationWard}
                            onAddressChange={handleAddressChange}
                          />
                          {getFieldError("address_selector")}
                          {(errors.province || errors.district || errors.ward) && (
                            <div className="mt-1 text-red-500 text-sm">
                              {errors.province && <p>{errors.province}</p>}
                              {errors.district && <p>{errors.district}</p>}
                              {errors.ward && <p>{errors.ward}</p>}
                            </div>
                          )}
                        </div>

                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                          {/* Address Details */}
                          <div className="w-full xl:w-1/2">
                            <InputGroup
                              label="Address Details"
                              name="addressDetail"
                              type="text"
                              placeholder="Enter detailed address"
                              className="w-full"
                              value={address}
                              onChange={handleAddressDetailChange}
                            />
                            {getFieldError("address")}
                          </div>

                          {/* Venue Name */}
                          <div className="w-full xl:w-1/2">
                            <InputGroup
                              label="Venue Name"
                              name="venueName"
                              type="text"
                              placeholder="Enter venue name"
                              className="w-full"
                              value={venueName}
                              onChange={handleVenueNameChange}
                            />
                            {getFieldError("venueName")}
                          </div>
                        </div>

                        <div className="mb-4.5">
                          <label className="text-body-sm font-medium text-dark dark:text-white">Content</label>
                          <div className="mt-3">
                            <TextEditor
                              setData={setContentData}
                              initialData={event ? event.content : ""}
                            />
                          </div>
                          {getFieldError("content")}
                        </div>

                        {/* Event Type Radio Selector - Enhanced */}
                        {type === "create" && (
                          <div className="mb-8">
                              <label className="block text-2xl p-4 border-t-2 border-amber-300 font-bold text-green-light-1 text-center dark:text-white mb-4">
                                EVENT TYPE
                              </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div
                                className={`relative flex-1 p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                  eventType === "seat"
                                    ? "border-primary bg-primary bg-opacity-10"
                                    : "border-gray-300 hover:border-primary hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  const e = { target: { value: "seat" } };
                                  handleEventTypeChange({ ...e, preventDefault: () => {} } as any);
                                }}
                              >
                                <input
                                  type="radio"
                                  name="eventType"
                                  value="seat"
                                  checked={eventType === "seat"}
                                  onChange={handleEventTypeChange}
                                  className="absolute top-4 right-4 h-5 w-5 accent-primary"
                                />
                                <div className="flex flex-col items-center text-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                       className={`w-12 h-12 mb-3 ${eventType === "seat" ? "text-primary" : "text-gray-600"}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" />
                                  </svg>
                                  <span className={`text-xl font-semibold ${eventType === "seat" ? "text-primary" : "text-gray-800"}`}>Seat</span>
                                  <p className="mt-2 text-gray-600">
                                    Event with numbered seats (e.g., theater seating)
                                  </p>
                                </div>
                              </div>

                              <div
                                className={`relative flex-1 p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                  eventType === "ticket"
                                    ? "border-primary bg-primary bg-opacity-10"
                                    : "border-gray-300 hover:border-primary hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  const e = { target: { value: "ticket" } };
                                  handleEventTypeChange({ ...e, preventDefault: () => {} } as any);
                                }}
                              >
                                <input
                                  type="radio"
                                  name="eventType"
                                  value="ticket"
                                  checked={eventType === "ticket"}
                                  onChange={handleEventTypeChange}
                                  className="absolute top-4 right-4 h-5 w-5 accent-primary"
                                />
                                <div className="flex flex-col items-center text-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                       className={`w-12 h-12 mb-3 ${eventType === "ticket" ? "text-primary" : "text-gray-600"}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                  </svg>
                                  <span className={`text-xl font-semibold ${eventType === "ticket" ? "text-primary" : "text-gray-800"}`}>Ticket</span>
                                  <p className="mt-2 text-gray-600">
                                    Event with multiple ticket types (e.g., festival passes)
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Conditional fields based on event type */}
                        {eventType === "seat" ? (
                          // Seat Event Fields
                          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                              <InputGroup
                                label="Seat Price"
                                name="seatPrice"
                                type="number"
                                placeholder="Enter price per seat"
                                className="w-full"
                                value={seatPrice}
                                onChange={handleSeatPriceChange}
                              />
                              {getFieldError("seatPrice")}
                            </div>
                            <div className="w-full xl:w-1/2">
                              <InputGroup
                                label="Booked Seats"
                                name="bookedSeats"
                                type="text"
                                placeholder="Enter booked seats (e.g., A1, B2, C3)"
                                className="w-full"
                                value={bookedSeats}
                                onChange={handleBookedSeatsChange}
                              />
                              {getFieldError("bookedSeats")}
                            </div>
                          </div>
                        ) : (
                          // Ticket Event Fields
                          <div className="mt-2 pt-2">
                            {/* Position Image Upload - Separate from ticket details */}
                            <div className="w-full mb-6 border-2 p-3 rounded-xl">
                              <label className="text-body-sm font-medium text-dark dark:text-white">Position
                                Image</label>
                              {positionImagePreview && (
                                <div className="mt-2 mb-3">
                                  <ImagePreview
                                    src={positionImagePreview.startsWith("blob:")
                                      ? positionImagePreview
                                      : `${process.env.NEXT_PUBLIC_API_URL}${positionImagePreview}`}
                                    altText="Position Preview"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col gap-4.5 xl:flex-row">
                                <div className="w-full">
                                  <InputGroup
                                    name="positionImage"
                                    type="file"
                                    fileStyleVariant="style1"
                                    placeholder="Upload position image"
                                    className="w-full"
                                    onChange={handlePositionImageChange}
                                  />
                                  {getFieldError("positionImage")}
                                </div>
                                <button
                                  type="button"
                                  className={`inline-flex xl:w-1/4 items-center justify-center px-3 py-2 xl:mt-3 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary ${
                                    isUploadingPosition ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
                                  } focus:outline-none`}
                                  onClick={handlePositionImageUpload}
                                  disabled={isUploadingPosition || !positionImage}
                                >
                                  {isUploadingPosition ? (
                                    <>
                                  <span
                                    className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                                      Uploading...
                                    </>
                                  ) : (
                                    "UPLOAD"
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">Tickets</h3>

                              {/* Add ticket button */}
                              {type === "create" && (
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none"
                                  onClick={handleAddTicket}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20"
                                       fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                          clipRule="evenodd" />
                                  </svg>
                                  Add Ticket
                                </button>
                              )}
                            </div>

                            {getFieldError("tickets")}

                            {/* Ticket Form Fields */}
                            {tickets.map((ticket, index) => (
                              <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50 relative">
                                {/* Delete button for ticket */}
                                {tickets.length > 0 && type === "create" && (
                                  <button
                                    type="button"
                                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                    onClick={() => handleRemoveTicket(index)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                         fill="currentColor">
                                      <path fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd" />
                                    </svg>
                                  </button>
                                )}

                                <h4 className="text-md font-medium mb-4">Ticket #{index + 1}</h4>

                                <div className="mb-4">
                                  <InputGroup
                                    label="Title"
                                    type="text"
                                    placeholder="Enter ticket title"
                                    value={ticket.title || ""}
                                    onChange={(e) => handleTicketChange(index, "title", e.target.value)}
                                    required
                                  />
                                  {getFieldError(`ticket_${index}_title`)}
                                </div>

                                <div className="mb-4">
                                  <InputGroup
                                    label="Description"
                                    type="text"
                                    placeholder="Enter ticket description"
                                    value={ticket.description || ""}
                                    onChange={(e) => handleTicketChange(index, "description", e.target.value)}
                                  />
                                </div>

                                <div className="mb-4 flex flex-col gap-4 xl:flex-row">
                                  <div className="w-full xl:w-1/3">
                                    <InputGroup
                                      label="Price"
                                      type="number"
                                      placeholder="Enter ticket price"
                                      className="w-full"
                                      value={ticket.price || ""}
                                      onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                                      required
                                    />
                                    {getFieldError(`ticket_${index}_price`)}
                                  </div>

                                  <div className="w-full xl:w-1/3">
                                    <InputGroup
                                      label="Type"
                                      type="text"
                                      placeholder="Enter ticket type (e.g. VIP, Standard)"
                                      className="w-full"
                                      value={ticket.type || ""}
                                      onChange={(e) => handleTicketChange(index, "type", e.target.value)}
                                    />
                                  </div>

                                  <div className="w-full xl:w-1/3">
                                    <InputGroup
                                      label="Quantity"
                                      type="number"
                                      placeholder="Enter ticket quantity"
                                      className="w-full"
                                      value={ticket.quantity || ""}
                                      onChange={(e) => handleTicketChange(index, "quantity", e.target.value)}
                                      required
                                    />
                                    {getFieldError(`ticket_${index}_quantity`)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </form>
                      {/* The rest of the form content is the same as in the original code */}
                    </form>
                  </div>

                  {/* Completely transparent container with just the Save button */}
                  <div className="absolute bottom-0 left-0 right-[17px] p-5.5 bg-transparent z-9999">
                    <button
                      onClick={handleSubmit}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
                      } focus:outline-none`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                        <span
                          className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
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

