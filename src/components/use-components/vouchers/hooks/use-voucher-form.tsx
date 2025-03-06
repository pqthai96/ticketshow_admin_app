import { useState, useEffect } from "react";
import axiosClient from "@/api-client/api-client";

export interface FormErrors {
  [key: string]: string | null;
}

export interface VoucherFormData {
  id?: number | null;
  code: string;
  name: string;
  description: string;
  value: number | string;
  minOrderTotal: number | string;
  startedAt: string;
  endedAt: string;
}

export const useVoucherForm = (voucher: any, type: string) => {
  // Form validation states
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [minOrderTotal, setMinOrderTotal] = useState<string>("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [endedAt, setEndedAt] = useState<string>("");

  // Reset state when voucher changes
  useEffect(() => {
    if (voucher) {
      setCode(voucher.code || "");
      setName(voucher.name || "");
      setDescription(voucher.description || "");
      setValue(voucher.value?.toString() || "");
      setMinOrderTotal(voucher.minOrderTotal?.toString() || "");

      // Format dates for the input fields (YYYY-MM-DD)
      if (voucher.startedAt) {
        setStartedAt(formatDateForInput(new Date(voucher.startedAt)));
      }
      if (voucher.endedAt) {
        setEndedAt(formatDateForInput(new Date(voucher.endedAt)));
      }

      setIsLoading(false);
      setErrors({});
    } else {
      // Set default for create mode
      if (type === "create") {
        resetForm();
      }
    }
  }, [voucher, type]);

  // Format date for input fields
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Generate random voucher code
  const generateVoucherCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(result);
    clearError('code');
  };

  // Handler for code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCode(value);
    clearError('code');
  };

  // Handler for name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    clearError('name');
  };

  // Handler for description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    clearError('description');
  };

  // Handler for value change
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setValue(value);
    clearError('value');
  };

  // Handler for minOrderTotal change
  const handleMinOrderTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMinOrderTotal(value);
    clearError('minOrderTotal');
  };

  // Handler for startedAt change
  const handleStartedAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartedAt(e.target.value);
    clearError('startedAt');

    // If the end date is before the start date, clear the end date
    if (endedAt && new Date(e.target.value) > new Date(endedAt)) {
      setEndedAt('');
    }
  };

  // Handler for endedAt change
  const handleEndedAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndedAt(e.target.value);
    clearError('endedAt');
  };

  // Clear a specific error
  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Helper function to display field error
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  // Validate form fields
  const validateForm = (formData: VoucherFormData): boolean => {
    const newErrors: FormErrors = {};

    // Validate code
    if (!formData.code?.trim()) {
      newErrors.code = "Voucher code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Voucher code must be at least 3 characters";
    }

    // Validate name
    if (!formData.name?.trim()) {
      newErrors.name = "Voucher name is required";
    }

    // Validate description
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate value
    if (!formData.value) {
      newErrors.value = "Value is required";
    } else if (parseFloat(formData.value.toString()) <= 0) {
      newErrors.value = "Value must be greater than 0";
    }

    // Validate minOrderTotal
    if (!formData.minOrderTotal) {
      newErrors.minOrderTotal = "Minimum order total is required";
    } else if (parseFloat(formData.minOrderTotal.toString()) < 0) {
      newErrors.minOrderTotal = "Minimum order total cannot be negative";
    }

    // Validate startedAt
    if (!formData.startedAt) {
      newErrors.startedAt = "Start date is required";
    }

    // Validate endedAt
    if (!formData.endedAt) {
      newErrors.endedAt = "End date is required";
    } else if (formData.startedAt && new Date(formData.startedAt) > new Date(formData.endedAt)) {
      newErrors.endedAt = "End date cannot be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async () => {
    // Collect form data
    const formDataObj: VoucherFormData = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      value: parseFloat(value),
      minOrderTotal: parseFloat(minOrderTotal),
      startedAt: startedAt,
      endedAt: endedAt
    };

    // Validate form data
    if (!validateForm(formDataObj)) {
      console.error("Form validation failed:", errors);
      return false;
    }

    // Show submitting state
    setIsSubmitting(true);
    console.log(formDataObj);

    try {
      // Add voucher ID for edit mode
      if (type === "edit" && voucher?.id) {
        formDataObj.id = voucher.id;
      }

      // Make API request
      const endpoint = type === "create" ? '/voucher/create' : '/voucher/update';
      const response = await axiosClient.post(endpoint, formDataObj);

      if (type === "create") {
        resetForm();
      }

      console.log("Form submission successful:", response);
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(prev => ({ ...prev, submit: "Failed to submit voucher. Please try again." }));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // Reset all form fields
    setCode("");
    setName("");
    setDescription("");
    setValue("");
    setMinOrderTotal("");
    setStartedAt("");
    setEndedAt("");

    // Clear errors
    setErrors({});
  }

  return {
    // States
    errors,
    isLoading,
    isSubmitting,
    code,
    name,
    description,
    value,
    minOrderTotal,
    startedAt,
    endedAt,

    // Actions
    handleCodeChange,
    handleNameChange,
    handleDescriptionChange,
    handleValueChange,
    handleMinOrderTotalChange,
    handleStartedAtChange,
    handleEndedAtChange,
    generateVoucherCode,
    validateForm,
    handleSubmit,
    getFieldError,
  };
};