import React from "react";
import { EventTypeSelectorProps } from "../types";

export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
                                                                      eventType,
                                                                      onChange
                                                                    }) => {
  const handleSeatClick = () => {
    const e = { target: { value: "seat" } };
    onChange({ ...e, preventDefault: () => {} } as any);
  };

  const handleTicketClick = () => {
    const e = { target: { value: "ticket" } };
    onChange({ ...e, preventDefault: () => {} } as any);
  };

  return (
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
          onClick={handleSeatClick}
        >
          <input
            type="radio"
            name="eventType"
            value="seat"
            checked={eventType === "seat"}
            onChange={onChange}
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
          onClick={handleTicketClick}
        >
          <input
            type="radio"
            name="eventType"
            value="ticket"
            checked={eventType === "ticket"}
            onChange={onChange}
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
  );
};