import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useOrganiserForm } from "./hooks/use-organiser-form";
import { AvatarImageUploader } from "./components/avatar-image-upload";
import { OrganiserBasicInfoForm } from "./components/organiser-basic-info-form";

interface OrganiserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organiser?: any;
  type: "create" | "edit";
}

export function OrganiserDialogPanel({ isOpen, onClose, organiser, type }: OrganiserDialogProps) {
  const {
    errors,
    isLoading,
    isSubmitting,
    name,
    description,
    avatarImageUpload,

    handleNameChange,
    handleDescriptionChange,
    handleSubmit,
    getFieldError,
  } = useOrganiserForm(organiser, type);

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
            <Dialog.Panel className="w-[500px] max-h-[90vh] bg-white rounded-2xl pt-6 pl-6 pb-2 pr-6 shadow-xl relative flex flex-col">
              {/* Header with title */}
              <div className="flex items-center mb-6 pr-10">
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  ORGANISER {type === "edit" ? "EDIT" : "CREATE"} INFORMATION
                  {organiser && (<span className="text-green-dark"> - {organiser.name}</span>)}
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
                  <span className="ml-3">Loading organiser data...</span>
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

                    {/* Avatar Image Upload */}
                    <AvatarImageUploader
                      imagePreview={avatarImageUpload.imagePreview}
                      oldImagePreview={avatarImageUpload.oldImagePreview}
                      onChange={avatarImageUpload.handleImageChange}
                      error={errors.avatarImage}
                      label="Avatar Image"
                      name="avatarImage"
                      description="Recommended size: 300x300, Max size: 5MB"
                      inputRef={avatarImageUpload.inputRef}
                    />

                    {/* Main Form */}
                    <form id="organiserForm">
                      {/* Basic Information */}
                      <OrganiserBasicInfoForm
                        name={name}
                        description={description}
                        onNameChange={handleNameChange}
                        onDescriptionChange={handleDescriptionChange}
                        errors={errors}
                        getFieldError={getFieldError}
                        type={type}
                      />
                    </form>
                  </div>

                  {/* Submit button container */}
                  <div className="absolute bottom-0 left-0 right-[17px] rounded-2xl p-5.5 bg-gradient-to-t from-white to-transparent z-10">
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