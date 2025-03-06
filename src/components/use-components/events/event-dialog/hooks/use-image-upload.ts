// hooks/use-image-upload.ts
import { useState, useRef } from "react";
import { FormErrors } from "../types";

interface UseImageUploadParams {
  isBanner?: boolean;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

export const useImageUpload = ({ isBanner = true, setErrors }: UseImageUploadParams) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [oldImagePreview, setOldImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate image file
  const validateImageFile = (file: File) => {
    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Image must be smaller than 10MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      };
    }

    // For banner images, we'll check aspect ratio
    if (isBanner) {
      return new Promise((resolve) => {
        const img = document.createElement('img'); // Thay đổi cách tạo phần tử image
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);

          const minRatio = 1280 / 720;
          const maxRatio = 1560 / 600;
          const actualRatio = img.width / img.height;

          const tolerance = 0.05;

          if (actualRatio < minRatio * (1 - tolerance) || actualRatio > maxRatio * (1 + tolerance)) {
            resolve({
              valid: false,
              error: `Banner image should have an aspect ratio between ${minRatio.toFixed(2)}:1 and ${maxRatio.toFixed(2)}:1. Current ratio: ${actualRatio.toFixed(2)}:1`
            });
          } else {
            resolve({ valid: true, error: null });
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve({ valid: false, error: "Invalid image file" });
        };

        img.src = objectUrl;
      });
    }

    return { valid: true, error: null };
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation: any = await validateImageFile(file);

    if (!validation.valid) {
      const fieldName = isBanner ? "bannerImage" : "positionImage";
      setErrors(prev => ({ ...prev, [fieldName]: validation.error }));

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
    const fieldName = isBanner ? "bannerImage" : "positionImage";
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
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