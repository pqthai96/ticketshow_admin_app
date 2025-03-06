import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useVoucherForm } from "./hooks/use-voucher-form";
import { VoucherBasicInfoForm } from "./components/voucher-basic-info-form";
import { VoucherValueForm } from "./components/voucher-value-form";
import { VoucherValidityForm } from "./components/voucher-validity-form";

interface VoucherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  voucher?: any;
  type: "create" | "edit";
}

export function VoucherDialogPanel({ isOpen, onClose, voucher, type }: VoucherDialogProps) {
  const {
    errors,
    isLoading,
    isSubmitting,
    code,
    name,
    description,
    value,
    minOrderTotal,
    startedAt,
    endedAt,

    handleCodeChange,
    handleNameChange,
    handleDescriptionChange,
    handleValueChange,
    handleMinOrderTotalChange,
    handleStartedAtChange,
    handleEndedAtChange,
    generateVoucherCode,
    handleSubmit,
    getFieldError,
  } = useVoucherForm(voucher, type);

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
                  VOUCHER {type === "edit" ? "EDIT" : "CREATE"} INFORMATION
                  {voucher && (<span className="text-green-dark"> - {voucher.name}</span>)}
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
                  <span className="ml-3">Loading voucher data...</span>
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

                    {/* Main Form */}
                    <form id="voucherForm">
                      {/* Basic Information */}
                      <VoucherBasicInfoForm
                        code={code}
                        name={name}
                        description={description}
                        onCodeChange={handleCodeChange}
                        onNameChange={handleNameChange}
                        onDescriptionChange={handleDescriptionChange}
                        generateVoucherCode={generateVoucherCode}
                        errors={errors}
                        getFieldError={getFieldError}
                        type={type}
                      />

                      {/* Value Information */}
                      <VoucherValueForm
                        value={value}
                        minOrderTotal={minOrderTotal}
                        onValueChange={handleValueChange}
                        onMinOrderTotalChange={handleMinOrderTotalChange}
                        errors={errors}
                        getFieldError={getFieldError}
                      />

                      {/* Validity Period */}
                      <VoucherValidityForm
                        startedAt={startedAt}
                        endedAt={endedAt}
                        onStartedAtChange={handleStartedAtChange}
                        onEndedAtChange={handleEndedAtChange}
                        errors={errors}
                        getFieldError={getFieldError}
                      />
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