import React from "react";
import { TicketManagementFormProps } from "../types";
import { TicketFormItem } from "@/components/use-components/events/event-dialog/components/ticket-form-item";

export const TicketManagementForm: React.FC<TicketManagementFormProps> = ({
                                                                            tickets,
                                                                            onAddTicket,
                                                                            onRemoveTicket,
                                                                            onTicketChange,
                                                                            errors,
                                                                            isCreateMode
                                                                          }) => {
  // Helper function to display field error
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  return (
    <div className="mt-2 pt-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tickets</h3>

        {/* Add ticket button */}
        {isCreateMode && (
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none"
            onClick={onAddTicket}
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
        <TicketFormItem
          key={index}
          ticket={ticket}
          index={index}
          onTicketChange={onTicketChange}
          onRemoveTicket={onRemoveTicket}
          errors={errors}
          isCreateMode={isCreateMode}
        />
      ))}
    </div>
  );
};