import React from "react";
import { ImagePreview } from "@/components/image-preview";
import InputGroup from "@/components/FormElements/InputGroup";
import { ImageUploaderProps } from "../types";

export const BannerImageUploader: React.FC<ImageUploaderProps> = ({
                                                                    imagePreview,
                                                                    oldImagePreview,
                                                                    onChange,
                                                                    error,
                                                                    label,
                                                                    name,
                                                                    description,
                                                                    inputRef
                                                                  }) => {
  return (
    <div className="mb-4.5">
      <div className="w-full border-2 p-3 rounded-xl">
        <label className="text-body-sm font-medium text-dark dark:text-white mb-2 block">
          {label || "Banner Image"} {description && `(${description})`}
        </label>

        {/* Image Preview Section with Before/After */}
        {(imagePreview || oldImagePreview) && (
          <div className="mt-2 mb-3">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Old image */}
              {oldImagePreview && imagePreview !== oldImagePreview && (
                <div className="w-full md:w-1/2">
                  <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                  <ImagePreview
                    src={oldImagePreview.startsWith("blob:")
                      ? oldImagePreview
                      : `${process.env.NEXT_PUBLIC_API_URL}${oldImagePreview}`}
                    altText="Current Image"
                  />
                </div>
              )}

              {/* Arrow between images */}
              {oldImagePreview && imagePreview !== oldImagePreview && (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}

              {/* New image */}
              {imagePreview && (
                <div className={`w-full ${oldImagePreview && imagePreview !== oldImagePreview ? 'md:w-1/2' : 'w-full'}`}>
                  {oldImagePreview && imagePreview !== oldImagePreview && (
                    <p className="text-sm text-gray-500 mb-1">New Image:</p>
                  )}
                  <ImagePreview
                    src={imagePreview.startsWith("blob:")
                      ? imagePreview
                      : `${process.env.NEXT_PUBLIC_API_URL}${imagePreview}`}
                    altText="Image Preview"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4.5 xl:flex-row">
          <div className="w-full">
            <InputGroup
              name={name || "image"}
              type="file"
              accept="image/*"
              fileStyleVariant="style1"
              placeholder={`Upload ${label.toLowerCase() || "image"}`}
              className="w-full"
              onChange={onChange}
              ref={inputRef}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};