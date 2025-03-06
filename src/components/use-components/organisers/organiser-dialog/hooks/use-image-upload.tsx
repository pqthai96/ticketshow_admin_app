import { useState, useRef } from "react";
import { FormErrors } from "./use-organiser-form";

interface UseImageUploadParams {
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

export const useImageUpload = ({ setErrors }: UseImageUploadParams) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [oldImagePreview, setOldImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate image file
  const validateImageFile = (file: File) => {
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Image must be smaller than 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      };
    }

    return { valid: true, error: null };
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);

    if (!validation.valid) {
      // @ts-ignore
      setErrors(prev => ({ ...prev, avatarImage: validation.error }));

      // Reset the file input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    setImage(file);

    if (imagePreview && !imagePreview.startsWith("blob:")) {
      setOldImagePreview(imagePreview);
    }

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    // Clear any previous error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.avatarImage;
      return newErrors;
    });
  };

  const resetImage = () => {
    setImage(null);
    setImagePreview("");
    setOldImagePreview("");
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return {
    image,
    imagePreview,
    oldImagePreview,
    isUploading,
    inputRef,
    handleImageChange,
    setImagePreview,
    setOldImagePreview,
    resetImage,
    setImage,
  };
};