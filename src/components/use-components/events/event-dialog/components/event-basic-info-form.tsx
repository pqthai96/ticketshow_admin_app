import React from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { EventBasicInfoFormProps } from "../types";

export const EventBasicInfoForm: React.FC<EventBasicInfoFormProps> = ({
                                                                        selectedStatus,
                                                                        selectedCategory,
                                                                        categories,
                                                                        isLoadingCategories,
                                                                        selectedOrganiser,
                                                                        organisers,
                                                                        isLoadingOrganisers,
                                                                        onStatusChange,
                                                                        onCategoryChange,
                                                                        onOrganiserChange,
                                                                        errors,
                                                                        eventData,
                                                                        type
                                                                      }) => {
  // Helper function to display field error
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  return (
    <>
      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
        <div className="w-full">
          <InputGroup
            label="Title"
            name="title"
            type="text"
            placeholder="Enter event's title"
            className="w-full"
            defaultValue={eventData?.title || ""}
          />
          {getFieldError("title")}
        </div>

        {type === "edit" && <div className="w-full xl:w-1/4">
          <Select
            label="Status"
            name="status"
            placeholder="Select status"
            className="w-full"
            items={[
              { label: "Active", value: "1" },
              { label: "Ended", value: "2" }
            ]}
            value={selectedStatus}
            onChange={onStatusChange}
          />
          {getFieldError("status")}
        </div>}
      </div>

      {/* Category Selection */}
      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
        <div className="w-full xl:w-1/2">
          <Select
            label="Organiser"
            name="organiser"
            placeholder="Select organiser"
            className="w-full"
            items={organisers.map(organiser => ({
              label: organiser.name,
              value: organiser.id
            }))}
            value={selectedOrganiser}
            onChange={onOrganiserChange}
            isLoading={isLoadingOrganisers}
          />
          {getFieldError("organiser")}
        </div>
        <div className="w-full xl:w-1/2">
          <Select
            label="Category"
            name="category"
            placeholder="Select event category"
            className="w-full"
            items={categories.map(category => ({
              label: category.name,
              value: category.id
            }))}
            value={selectedCategory}
            onChange={onCategoryChange}
            isLoading={isLoadingCategories}
          />
          {getFieldError("category")}
        </div>
      </div>

      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
        <div className="w-full xl:w-1/2">
          <InputGroup
            label="Started At"
            name="startedAt"
            type="date"
            placeholder=""
            className="w-full"
            defaultValue={eventData?.startedAt ? new Date(eventData.startedAt).toLocaleDateString('en-CA') : ""}
          />
          {getFieldError("startedAt")}
        </div>
        <div className="w-full xl:w-1/2">
          <InputGroup
            label="Ended At"
            name="endedAt"
            type="date"
            placeholder=""
            className="w-full"
            defaultValue={eventData?.endedAt ? new Date(eventData.endedAt).toLocaleDateString('en-CA') : ""}
          />
          {getFieldError("endedAt")}
        </div>
      </div>
    </>
  );
};