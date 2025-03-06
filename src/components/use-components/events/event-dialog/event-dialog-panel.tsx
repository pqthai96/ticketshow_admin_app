import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import TextEditor from "@/components/text-editor";
import { BannerImageUploader } from "./components/banner-image-upload";
import { PositionImageUploader } from "./components/position-image-upload";
import { EventBasicInfoForm } from "./components/event-basic-info-form";
import { EventLocationForm } from "./components/event-location-form";
import { EventTypeSelector } from "./components/event-type-selector";
import { SeatDetailsForm } from "./components/seat-details-form";
import { TicketManagementForm } from "./components/ticket-management-form";
import { useEventForm } from "./hooks/use-event-form";
import { EventDialogProps } from "./types";

export function EventDialogPanel({ isOpen, onClose, event, type }: EventDialogProps) {
  const {
    errors,
    contentData,
    isLoading,
    isSubmitting,
    tickets,
    categories,
    isLoadingCategories,
    selectedCategory,
    organisers,
    isLoadingOrganisers,
    selectedOrganiser,
    selectedStatus,
    eventType,
    seatPrice,
    bookedSeats,
    address,
    venueName,
    bannerImageUpload,
    positionImageUpload,

    setContentData,
    handleCategoryChange,
    handleOrganiserChange,
    handleStatusChange,
    handleEventTypeChange,
    handleSeatPriceChange,
    handleAddressChange,
    handleAddressDetailChange,
    handleVenueNameChange,
    handleAddTicket,
    handleRemoveTicket,
    handleTicketChange,
    handleSubmit,
    getFieldError,
  } = useEventForm(event, type);

  const onFormSubmit = async () => {
    try {
      const success = await handleSubmit();

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
            <Dialog.Panel className="w-[80vw] max-h-[90vh] bg-white rounded-2xl pt-6 pl-6 pb-2 pr-6 shadow-xl relative flex flex-col">
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

                    {/* Banner Image Upload */}
                    <BannerImageUploader
                      imagePreview={bannerImageUpload.imagePreview}
                      oldImagePreview={bannerImageUpload.oldImagePreview}
                      onChange={bannerImageUpload.handleImageChange}
                      error={errors.bannerImage}
                      label="Banner Image"
                      name="bannerImage"
                      description="Recommended ratio: 1560x600 to 1280x720, Max size: 10MB"
                      inputRef={bannerImageUpload.inputRef}
                    />

                    {/* Main Form */}
                    <form id="eventForm">
                      {/* Basic Information */}
                      <EventBasicInfoForm
                        selectedStatus={selectedStatus}
                        selectedCategory={selectedCategory}
                        categories={categories}
                        isLoadingCategories={isLoadingCategories}
                        selectedOrganiser={selectedOrganiser}
                        organisers={organisers}
                        isLoadingOrganisers={isLoadingOrganisers}
                        onStatusChange={handleStatusChange}
                        onCategoryChange={handleCategoryChange}
                        onOrganiserChange={handleOrganiserChange}
                        errors={errors}
                        eventData={event}
                        type={type}
                      />

                      {/* Location Information */}
                      <EventLocationForm
                        address={address}
                        venueName={venueName}
                        onAddressChange={handleAddressChange}
                        onAddressDetailChange={handleAddressDetailChange}
                        onVenueNameChange={handleVenueNameChange}
                        errors={errors}
                        eventData={event}
                      />

                      {/* Content Editor */}
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

                      {/* Event Type Selector for Create mode */}
                      {type === "create" && (
                        <EventTypeSelector
                          eventType={eventType}
                          onChange={handleEventTypeChange}
                        />
                      )}

                      {/* Conditional fields based on event type */}
                      {eventType === "seat" ? (
                        // Seat Event Fields
                        <SeatDetailsForm
                          seatPrice={seatPrice}
                          bookedSeats={bookedSeats}
                          onSeatPriceChange={handleSeatPriceChange}
                          errors={errors}
                          type={type}
                        />
                      ) : (
                        <>
                          {/* Position Image Upload */}
                          <PositionImageUploader
                            imagePreview={positionImageUpload.imagePreview}
                            oldImagePreview={positionImageUpload.oldImagePreview}
                            onChange={positionImageUpload.handleImageChange}
                            error={errors.positionImage}
                            label="Position Image"
                            name="positionImage"
                            description="Max size: 10MB"
                            inputRef={positionImageUpload.inputRef}
                          />

                          {/* Ticket Management Form */}
                          <TicketManagementForm
                            tickets={tickets}
                            onAddTicket={handleAddTicket}
                            onRemoveTicket={handleRemoveTicket}
                            onTicketChange={handleTicketChange}
                            errors={errors}
                            isCreateMode={type === "create"}
                          />
                        </>
                      )}
                    </form>
                  </div>

                  {/* Submit button container */}
                  <div className="absolute bottom-0 left-0 right-[17px] p-5.5 bg-gradient-to-t from-white to-transparent z-10">
                    <button
                      onClick={onFormSubmit}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
                      } focus:outline-none`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></span>
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