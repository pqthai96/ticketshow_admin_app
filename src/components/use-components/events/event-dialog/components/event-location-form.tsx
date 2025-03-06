import React from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import AddressSelector from "@/components/address-selector";
import { EventLocationFormProps } from "../types";

export const EventLocationForm: React.FC<EventLocationFormProps> = ({
                                                                      address,
                                                                      venueName,
                                                                      onAddressChange,
                                                                      onAddressDetailChange,
                                                                      onVenueNameChange,
                                                                      errors,
                                                                      eventData
                                                                    }) => {
  // Helper function to display field error
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  return (
    <>
      {/* Address Selection */}
      <div className="mb-2">
        <AddressSelector
          initialProvince={eventData?.locationProvince}
          initialDistrict={eventData?.locationDistrict}
          initialWard={eventData?.locationWard}
          onAddressChange={onAddressChange}
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
            onChange={onAddressDetailChange}
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
            onChange={onVenueNameChange}
          />
          {getFieldError("venueName")}
        </div>
      </div>
    </>
  );
};