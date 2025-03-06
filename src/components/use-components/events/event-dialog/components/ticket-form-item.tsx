import React from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { TicketFormItemProps } from "../types";

export const TicketFormItem: React.FC<TicketFormItemProps> = ({
                                                                ticket,
                                                                index,
                                                                onTicketChange,
                                                                onRemoveTicket,
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
    <div className="mb-6 p-4 border rounded-lg bg-gray-50 relative">
      {/* Delete button for ticket */}
      {isCreateMode && (
        <button
          type="button"
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          onClick={() => onRemoveTicket(index)}
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
          onChange={(e) => onTicketChange(index, "title", e.target.value)}
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
          onChange={(e) => onTicketChange(index, "description", e.target.value)}
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
            onChange={(e) => onTicketChange(index, "price", e.target.value)}
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
            onChange={(e) => onTicketChange(index, "type", e.target.value)}
          />
        </div>

        <div className="w-full xl:w-1/3">
          <InputGroup
            label="Quantity"
            type="number"
            placeholder="Enter ticket quantity"
            className="w-full"
            value={ticket.quantity || ""}
            onChange={(e) => onTicketChange(index, "quantity", e.target.value)}
            required
          />
          {getFieldError(`ticket_${index}_quantity`)}
        </div>
      </div>
    </div>
  );
};