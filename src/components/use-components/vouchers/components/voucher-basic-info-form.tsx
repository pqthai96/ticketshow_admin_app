import React from "react";
import { FormErrors } from "../hooks/use-voucher-form";

interface VoucherBasicInfoFormProps {
  code: string;
  name: string;
  description: string;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  generateVoucherCode: () => void;
  errors: FormErrors;
  getFieldError: (fieldName: string) => JSX.Element | null;
  type: string;
}

export const VoucherBasicInfoForm = ({
                                       code,
                                       name,
                                       description,
                                       onCodeChange,
                                       onNameChange,
                                       onDescriptionChange,
                                       generateVoucherCode,
                                       errors,
                                       getFieldError,
                                       type
                                     }: VoucherBasicInfoFormProps) => {
  return (
    <div className="mb-4.5 bg-white dark:bg-form-input">
      <h3 className="font-semibold text-lg mb-3">Basic Information</h3>

      {/* Voucher Code */}
      <div className="mb-3">
        <label htmlFor="code" className="text-body-sm font-medium text-dark dark:text-white">
          Voucher Code <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center mt-2">
          <input
            type="text"
            id="code"
            name="code"
            value={code}
            onChange={onCodeChange}
            className="flex-1 p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input font-mono uppercase"
            placeholder="Enter voucher code"
            maxLength={16}
            disabled={type === "edit"}
          />
          <button
            type="button"
            onClick={generateVoucherCode}
            className="ml-2 px-3 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            disabled={type === "edit"}
          >
            Generate
          </button>
        </div>
        {type === "edit" && (
          <p className="text-xs text-gray-500 mt-1">
            Voucher code cannot be changed after creation.
          </p>
        )}
        {getFieldError('code')}
      </div>

      {/* Voucher Name */}
      <div className="mb-3">
        <label htmlFor="name" className="text-body-sm font-medium text-dark dark:text-white">
          Voucher Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onNameChange}
          className="w-full mt-2 p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input"
          placeholder="Enter voucher name"
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
          rows={3}
          className="w-full mt-2 p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input"
          placeholder="Enter voucher description"
        />
        {getFieldError('description')}
      </div>
    </div>
  );
};