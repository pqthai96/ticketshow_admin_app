import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Select } from "@/components/FormElements/select";
import axiosClient from "@/api-client/api-client";

export function OrderDialogPanel({ isOpen, onClose, order, type }: {
  isOpen: boolean,
  onClose: () => void,
  order?: any,
  type: string
}) {
  // Main states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderStatus, setOrderStatus] = useState<string>("4");

  // Initialize or reset state when order changes
  useEffect(() => {
    if (order) {
      setOrderStatus(order.statusDTO?.id.toString() || "4");
      setErrors({});
      setIsLoading(false);
    }
  }, [order]);

  // Status change handler
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderStatus(e.target.value);
  };

  // API interaction handlers
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      axiosClient.get(`/orders/update-status?orderId=${order.id}&statusId=${orderStatus}`).then((resp: any) => onClose());
    } catch (error) {
      console.error("Error updating order:", error);
      setErrors({ submit: "Failed to update order. Please try again." });
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

  const getStatusName = (statusId: number) => {
    switch (statusId) {
      case 4:
        return "PENDING";
      case 5:
        return "COMPLETED";
      case 6:
        return "CANCELLED";
      default:
        return "UNKNOWN";
    }
  };

  const calculateTotalAmount = (order: any) => {
    if (!order.orderItemDTOs || order.orderItemDTOs.length === 0) return 0;

    let total;

    if (order.eventDTO.type === true) {
      total = order.orderItemDTOs.reduce((sum: number, item: any) => {
        return sum + (item.ticketDTO?.price || 0) * (item.quantity || 0);
      }, 0);
    } else {
      total = order.orderItemDTOs.reduce((sum: number, item: any) => {
        return sum + order.eventDTO.seatPrice;
      }, 0);
    }

    // Apply voucher discount if available
    if (order.voucherDTO && order.voucherDTO.value) {
      total = Math.max(0, total - order.voucherDTO.value);
    }
    return total;
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
                  ORDER DETAILS
                  {order && (<span className="text-green-dark"> - {order.id}</span>)}
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
                  <span className="ml-3">Loading order data...</span>
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

                    {/* Order Details Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Basic Order Information */}
                      <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">Order Information</h4>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Order ID:</span>
                            <span>{order?.id || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Order Date:</span>
                            <span>{formatDate(order?.orderDate)}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Customer Email:</span>
                            <span>{order?.userDTO?.email || order?.emailReceive || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Transaction ID:</span>
                            {order?.transactionId ? (
                              <a className="underline text-blue"
                                 href={`https://dashboard.stripe.com/test/payments/${order?.transactionId}`}
                                 target="_blank">{order?.transactionId}</a>

                              ) : (<span>
                              N/A
                            </span>)}
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Current Status:</span>
                            <span>
                              {order?.statusDTO?.name || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Event Information */}
                      <div className="border rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">Event Information</h4>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Event Title:</span>
                            <span>{order?.eventDTO?.title || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Venue:</span>
                            <span>{order?.eventDTO?.venueName || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Location:</span>
                            <span>{order?.eventDTO?.locationAddress || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Event Date:</span>
                            <span>{formatDate(order?.eventDTO?.startedAt)}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Event Type:</span>
                            <span>{order?.eventDTO?.type === true ? "Ticket" : "Seat"}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Category:</span>
                            <span>{order?.eventDTO?.categoryDTO?.name || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Voucher Information (if exists) */}
                    {order?.voucherDTO && (
                      <div className="border rounded-lg p-4 mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">Voucher Information</h4>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Voucher Code:</span>
                            <span className="font-semibold">{order.voucherDTO.code || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Voucher Name:</span>
                            <span>{order.voucherDTO.name || "N/A"}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Discount Value:</span>
                            <span>
                              {order.voucherDTO.value <= 1
                                ? `${(order.voucherDTO.value * 100).toFixed(0)}%`
                                : (order.voucherDTO.value)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Min Order Total:</span>
                            <span>{(order.voucherDTO.minOrderTotal || 0)}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Valid From:</span>
                            <span>{formatDate(order.voucherDTO.startedAt)}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Valid Until:</span>
                            <span>{formatDate(order.voucherDTO.endedAt)}</span>
                          </div>

                          <div className="grid grid-cols-2">
                            <span className="text-gray-500">Description:</span>
                            <span>{order.voucherDTO.description || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items Table */}
                    {order?.orderItemDTOs && order.orderItemDTOs.length > 0 && (
                      <div className="border rounded-lg justify-center p-4 mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">Order Items</h4>

                        <table className="w-full border-collapse text-center">
                          <thead>
                          <tr className="border-b">
                            {/* Show Ticket Type only if event type is false */}
                            {order.eventDTO?.type === true && (
                              <th className="pb-2 text-left">Ticket Type</th>
                            )}
                            {order.eventDTO?.type === false && (
                              <th className="pb-2">Seat(s)</th>
                            )}
                            <th className="pb-2">Quantity</th>
                            <th className="pb-2">Price</th>
                            <th className="pb-2">Subtotal</th>
                          </tr>
                          </thead>
                          <tbody>
                          {order.orderItemDTOs.map((item: any, index: number) => (
                            <tr key={index} className="border-b">
                              {/* Show Ticket Type only if event type is false */}
                              {order.eventDTO?.type === true && (
                                <td className="py-2 text-left">{item.ticketDTO?.title || "N/A"}</td>
                              )}
                              {order.eventDTO?.type === false && (
                                <td className="py-2">{item.seatValue || "N/A"}</td>
                              )}
                              <td className="py-2">{item.quantity || 0}</td>
                              {/* Show Seats only if event type is true */}
                              <td className="py-2">
                                ${order.eventDTO.type === true ? (item.ticketDTO?.price || 0) : (order.eventDTO.seatPrice)}
                              </td>
                              <td className="py-2">
                                ${order.eventDTO.type === true ? ((item.ticketDTO?.price || 0) * (item.quantity || 0)) : (order.eventDTO.seatPrice)}
                              </td>
                            </tr>
                          ))}
                          </tbody>
                          <tfoot>
                          <tr>
                            <td colSpan={3} className="py-2 text-right font-semibold">Subtotal:</td>
                            <td className="py-2 font-semibold">
                              ${order.eventDTO.type === true ? (
                              order.orderItemDTOs.reduce(
                                (sum: number, item: any) =>
                                  sum + (item.ticketDTO?.price || 0) * (item.quantity || 0),
                                0
                              )
                            ) : (
                              order.orderItemDTOs.reduce(
                                (sum: number, item: any) =>
                                  sum + order.eventDTO.seatPrice,
                                0
                              )
                            )}
                            </td>
                          </tr>
                          {order.voucherDTO && (
                            <tr>
                              <td colSpan={3} className="py-2 text-right font-semibold">
                                Discount:
                              </td>
                              <td className="py-2 font-semibold text-red-500">
                                -
                                ${order.voucherDTO.value}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan={3} className="py-2 text-right font-semibold">Total:</td>
                            <td className="py-2 font-semibold">
                              ${(calculateTotalAmount(order))}
                            </td>
                          </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}

                    {/* Editable Section - Order Status (only for pending orders) */}
                    {order?.statusDTO?.id === 4 && (
                      <div className="border rounded-lg p-4 mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b pb-2">Status Management</h4>

                        <div className="mb-4">
                          <Select
                            label="Order Status"
                            name="orderStatus"
                            placeholder="Select status"
                            className="w-full"
                            items={[
                              {
                                label: "Pending",
                                value: "4"
                              },
                              {
                                label: "Completed",
                                value: "5"
                              },
                              {
                                label: "Cancelled",
                                value: "6"
                              }
                            ]}
                            defaultValue={orderStatus}
                            onChange={handleStatusChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fixed button at bottom - only for pending orders */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-white shadow-md border-t">
                    {/* Ticket PDF Download */}
                    {order?.ticketPdfPath && (
                      <div className="flex items-center">
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}${order.ticketPdfPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Download Order Invoice
                        </a>
                      </div>
                    )}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                      >
                        {order?.statusDTO?.id === 4 ? "Cancel" : "Close"}
                      </button>

                      {order?.statusDTO?.id === 4 && (
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
                            "Save Changes"
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