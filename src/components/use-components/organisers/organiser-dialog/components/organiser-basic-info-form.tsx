import React from "react";
import { FormErrors } from "../hooks/use-organiser-form";

interface OrganiserBasicInfoFormProps {
  name: string;
  description: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: FormErrors;
  getFieldError: (fieldName: string) => JSX.Element | null;
  type: string;
}

export const OrganiserBasicInfoForm = ({
                                         name,
                                         description,
                                         onNameChange,
                                         onDescriptionChange,
                                         errors,
                                         getFieldError,
                                         type
                                       }: OrganiserBasicInfoFormProps) => {
  return (
    <div className="mb-4.5 bg-white dark:bg-form-input">
      <h3 className="font-semibold text-lg mb-3">Basic Information</h3>

      {/* Organiser Name */}
      <div className="mb-3">
        <label htmlFor="name" className="text-body-sm font-medium text-dark dark:text-white">
          Organiser Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onNameChange}
          className="w-full mt-2 p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input"
          placeholder="Enter organiser name"
        />
        {getFieldError('name')}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label htmlFor="description" className="text-body-sm font-medium text-dark dark:text-white">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={onDescriptionChange}
          rows={4}
          className="w-full mt-2 p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input"
          placeholder="Enter organiser description"
        />
        {getFieldError('description')}
      </div>
    </div>
  );
};