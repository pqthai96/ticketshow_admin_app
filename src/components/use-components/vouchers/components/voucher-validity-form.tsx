import React from "react";
import { FormErrors } from "../hooks/use-voucher-form";

interface VoucherValidityFormProps {
  startedAt: string;
  endedAt: string;
  onStartedAtChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndedAtChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  getFieldError: (fieldName: string) => JSX.Element | null;
}

export const VoucherValidityForm = ({
                                      startedAt,
                                      endedAt,
                                      onStartedAtChange,
                                      onEndedAtChange,
                                      errors,
                                      getFieldError
                                    }: VoucherValidityFormProps) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="mb-4.5 bg-white dark:bg-form-input">
      <h3 className="font-semibold text-lg mb-3">Validity Period</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label htmlFor="startedAt" className="text-body-sm font-medium text-dark dark:text-white">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startedAt"
            name="startedAt"
            value={startedAt}
            onChange={onStartedAtChange}
            className="w-full mt-2 p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input"
            min={today}
          />
          {getFieldError('startedAt')}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endedAt" className="text-body-sm font-medium text-dark dark:text-white">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endedAt"
            name="endedAt"
            value={endedAt}
            onChange={onEndedAtChange}
            className="w-full mt-2 p-3 border rounded-md outline-none focus:border-primary dark:bg-form-input"
            min={startedAt || today}
          />
          {getFieldError('endedAt')}
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs text-gray-500">
          The voucher will be automatically activated on the start date and will expire at the end of the end date.
        </p>
      </div>
    </div>
  );
};