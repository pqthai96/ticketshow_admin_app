import { useState, useEffect } from "react";
import { useImageUpload } from "./use-image-upload";
import axiosClient from "@/api-client/api-client";

export interface FormErrors {
  [key: string]: string;
}

export interface OrganiserFormData {
  id?: number | null;
  name: string;
  description: string;
  userId?: number | null;
  avatarImagePath?: string;
}

export const useOrganiserForm = (organiser: any, type: string) => {
  // Form validation states
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Avatar image hook
  const avatarImageUpload = useImageUpload({ setErrors });

  // Reset state when organiser changes
  useEffect(() => {
    if (organiser) {
      setName(organiser.name || "");
      setDescription(organiser.description || "");
      avatarImageUpload.setImagePreview(process.env.NEXT_PUBLIC_API_URL + organiser.avatarImagePath || "");
      avatarImageUpload.setOldImagePreview(process.env.NEXT_PUBLIC_API_URL + organiser.avatarImagePath || "");

      setIsLoading(false);
      setErrors({});
    } else {
      // Set default for create mode
      if (type === "create") {
        setName("");
        setDescription("");
        avatarImageUpload.resetImage();
      }
    }
  }, [organiser, type]);

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
  const validateForm = (formData: OrganiserFormData): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name?.trim()) {
      newErrors.name = "Organiser name is required";
    }

    // Validate description
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    // Avatar image validation
    if (type === "create" && !avatarImageUpload.image && !avatarImageUpload.imagePreview) {
      newErrors.avatarImage = "Avatar image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async () => {
    // Collect form data
    const formDataObj: OrganiserFormData = {
      name: name,
      description: description,
      avatarImagePath: avatarImageUpload.imagePreview || "",
    };

    // Validate form data
    if (!validateForm(formDataObj)) {
      console.error("Form validation failed:", errors);
      return false;
    }

    // Show submitting state
    setIsSubmitting(true);

    try {
      // Create FormData for submission with files
      const formData = new FormData();

      // Add all form data
      for (const key in formDataObj) {
        if (formDataObj[key as keyof OrganiserFormData] !== null && formDataObj[key as keyof OrganiserFormData] !== undefined) {
          formData.append(key, formDataObj[key as keyof OrganiserFormData] as string);
        }
      }

      // Add image if it exists
      if (avatarImageUpload.image) {
        formData.append('avatarImage', avatarImageUpload.image);
      }

      // Add organiser ID for edit mode
      if (type === "edit" && organiser?.id) {
        formData.append('id', organiser.id.toString());
      }

      // Make API request
      const endpoint = type === "create" ? '/organiser/create' : '/organiser/edit';
      const response = await axiosClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (type === "create") {
        resetForm();
      }

      console.log("Form submission successful:", response);
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(prev => ({ ...prev, submit: "Failed to submit organiser. Please try again." }));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // Reset all form fields
    setName("");
    setDescription("");

    // Reset image
    avatarImageUpload.resetImage();

    // Clear errors
    setErrors({});
  }

  return {
    // States
    errors,
    isLoading,
    isSubmitting,
    name,
    description,
    avatarImageUpload,

    // Actions
    handleNameChange,
    handleDescriptionChange,
    validateForm,
    handleSubmit,
    getFieldError,
  };
};