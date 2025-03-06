import React from "react";
import { FormErrors } from "../hooks/use-voucher-form";

interface VoucherValueFormProps {
  value: string;
  minOrderTotal: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinOrderTotalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  getFieldError: (fieldName: string) => JSX.Element | null;
}

export const VoucherValueForm = ({
                                   value,
                                   minOrderTotal,
                                   onValueChange,
                                   onMinOrderTotalChange,
                                   errors,
                                   getFieldError
                                 }: VoucherValueFormProps) => {
  return (
    <div className="mb-4.5 bg-white dark:bg-form-input">
      <h3 className="font-semibold text-lg mb-3">Value Information</h3>

      {/* Voucher Value */}
      <div className="mb-3">
        <label htmlFor="value" className="text-body-sm font-medium text-dark dark:text-white">
          Voucher Value <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-2">
          <input
            type="text"
            id="value"
            name="value"
            value={value}
            onChange={onValueChange}
            className="w-full p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input"
            placeholder="0"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            ${value}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter the discount amount.
        </p>
        {getFieldError('value')}
      </div>

      {/* Minimum Order Total */}
      <div className="mb-3">
        <label htmlFor="minOrderTotal" className="text-body-sm font-medium text-dark dark:text-white">
          Minimum Order Total <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-2">
          <input
            type="text"
            id="minOrderTotal"
            name="minOrderTotal"
            value={minOrderTotal}
            onChange={onMinOrderTotalChange}
            className="w-full p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input"
            placeholder="0"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            ${minOrderTotal && minOrderTotal}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum order amount required to use this voucher.
        </p>
        {getFieldError('minOrderTotal')}
      </div>
    </div>
  );
};