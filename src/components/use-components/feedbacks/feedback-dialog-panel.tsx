import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axiosClient from "@/api-client/api-client";
import TextEditor from "@/components/text-editor";

export function FeedbackDialogPanel({ isOpen, onClose, feedback }: {
  isOpen: boolean,
  onClose: () => void,
  feedback?: any
}) {
  // Main states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [replyContent, setReplyContent] = useState<string>("");

  // Initialize or reset state when feedback changes
  useEffect(() => {
    if (feedback) {
      setReplyContent(feedback.reply || "");
      setErrors({});
      setIsLoading(false);
    }
  }, [feedback]);

  // API interaction handlers
  const handleSubmit = async () => {
    // Validate reply
    if (!replyContent.trim()) {
      setErrors({ reply: "Reply content cannot be empty" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with your actual API endpoint
      await axiosClient.post(`/feedback/reply`, {
        feedbackId: feedback.id,
        replyContent: replyContent
      });
      onClose();
    } catch (error) {
      console.error("Error replying to feedback:", error);
      setErrors({ submit: "Failed to submit reply. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  // Component rendering
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
                  FEEDBACK DETAILS
                  {feedback && (<span className="text-green-dark"> - #{feedback.id}</span>)}
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
                  <span className="ml-3">Loading feedback data...</span>
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

                    {/* Feedback Details Sections */}
                    <div className="grid grid-cols-1 gap-6 mb-8">
                      {/* Basic Feedback Information */}
                      <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">Feedback Information</h4>

                        <div className="space-y-3">
                          <div className="grid grid-cols-3">
                            <span className="text-gray-500">Feedback ID:</span>
                            <span className="col-span-2">{feedback?.id || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-3">
                            <span className="text-gray-500">Status:</span>
                            <span className={`col-span-2 ${
                              feedback?.statusDTO.id === 4
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}>
                              {feedback?.statusDTO.id === 4 ? "PENDING" : "COMPLETED"}
                            </span>
                          </div>

                          <div className="grid grid-cols-3">
                            <span className="text-gray-500">Received Date:</span>
                            <span className="col-span-2">{formatDate(feedback?.createdAt)}</span>
                          </div>

                          <div className="grid grid-cols-3">
                            <span className="text-gray-500">User Email:</span>
                            <span className="col-span-2">{feedback?.email || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-3">
                            <span className="text-gray-500">Subject:</span>
                            <span className="col-span-2 font-medium">{feedback?.subject || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Feedback Message */}
                      <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">User Message</h4>
                        <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: feedback.content }}>
                        </div>
                      </div>

                      {/* Existing Reply (if any) */}
                      {feedback?.adminReply && (
                        <div className="border rounded-lg p-4">
                          <h4 className="text-lg font-semibold mb-4 border-b pb-2">Your Previous Reply</h4>
                          <div
                            className="p-4 bg-blue-50 rounded-lg"
                            dangerouslySetInnerHTML={{ __html: feedback.adminReply }}
                          />
                        </div>
                      )}

                      {/* Reply Editor (only for pending feedbacks or if admin wants to update previous reply) */}
                      {feedback.statusDTO.id === 4 && (
                        <div className="border rounded-lg p-4">
                          <h4 className="text-lg font-semibold mb-4 border-b pb-2">
                            Compose Reply
                          </h4>

                          <div className="mb-2">
                            <TextEditor
                              setData={setReplyContent}
                              initialData={feedback?.reply || ""}
                            />
                            {getFieldError("reply")}
                          </div>
                        </div>
                      )}
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

                        {feedback.statusDTO.id === 4 ? "Cancel" : "Close"}
                      </button>

                      {feedback.statusDTO.id === 4 && (
                        <button
                          onClick={handleSubmit}
                          className={`px-6 py-2 rounded-md text-white bg-primary ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
                          }`}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                            <span
                              className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full inline-block"></span>
                              Saving...
                            </>
                          ) : (
                            "Send Reply"
                          )}
                        </button>
                      )}
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