import React from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { SeatDetailsFormProps } from "../types";

export const SeatDetailsForm: React.FC<SeatDetailsFormProps> = ({
                                                                  seatPrice,
                                                                  bookedSeats,
                                                                  onSeatPriceChange,
                                                                  errors,
                                                                  type
                                                                }) => {
  // Helper function to display field error
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  const seatMap = [
    [
      ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"],
      ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9"],
      ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"],
      ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"],
      ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"],
      ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"]
    ],
    [
      ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9"],
      ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9"],
      ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I9"],
      ["J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9"],
      ["K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9"],
      ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9"]
    ]
  ];

  let bookedSeatsArray: any[] = [];
  if (type === "edit" && bookedSeats) {
    try {
      if (bookedSeats.trim().startsWith("[")) {
        bookedSeatsArray = JSON.parse(bookedSeats);
      } else {
        bookedSeatsArray = bookedSeats.split(",").map(seat => seat.trim());
      }
    } catch (e) {
      bookedSeatsArray = bookedSeats ? bookedSeats.split(",").map(seat => seat.trim()) : [];
      console.error("Error parsing bookedSeats:", e);
    }
  }

  return (
    <div>
      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
        <div className="w-full">
          <InputGroup
            label="Seat Price"
            name="seatPrice"
            type="number"
            placeholder="Enter price per seat"
            className="w-full"
            value={seatPrice}
            onChange={onSeatPriceChange}
          />
          {getFieldError("seatPrice")}
        </div>
      </div>

      <div className="mb-4.5">
        <label className="block text-lg font-medium text-dark dark:text-white mb-2 text-center">
          {type === "edit" ? "BOOKED SEATS" : "SEAT MAP DEMO"}
        </label>

        <div
          className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800 overflow-auto">
          {type === "edit" && (
            <div className="w-full flex justify-evenly mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-t-lg bg-white border border-gray-300"></div>
                <span className="text-sm font-medium">Available Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-t-lg bg-sky-700"></div>
                <span className="text-sm font-medium">Booked Seat</span>
              </div>
            </div>
          )}

          <div className="w-full flex justify-center mb-4">
            <div className="w-[400px] h-16 bg-neutral-600 flex items-center justify-center rounded-lg">
              <h1 className="text-2xl text-gray-300 font-semibold uppercase">Stage</h1>
            </div>
          </div>

          <div className="flex justify-center gap-8">
            {seatMap.map((seatBlock, index) => (
              <div key={index} className="flex flex-col gap-1">
                {seatBlock.map((seatCol, colIndex) => (
                  <div key={colIndex} className="flex flex-row items-center gap-1">
                    {seatCol.map((seatRow) => (
                      <div
                        key={seatRow}
                        className={`w-5 h-5 rounded-t-lg rounded-b-sm cursor-default flex items-center justify-center text-[8px] font-bold ${
                          type === "edit" && bookedSeatsArray.some(s =>
                            typeof s === "string" ? s.trim() === seatRow : s === seatRow
                          )
                            ? "bg-sky-700 text-white"
                            : "bg-white border border-gray-300 text-gray-700"
                        }`}
                        title={seatRow}
                      >
                        {seatRow}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <input
            type="hidden"
            name="bookedSeats"
            value={bookedSeats}
          />
        </div>
        {getFieldError("bookedSeats")}
      </div>
    </div>
  );
};