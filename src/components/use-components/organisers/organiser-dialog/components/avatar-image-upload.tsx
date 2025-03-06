import React from "react";

interface AvatarImageUploaderProps {
  imagePreview: string;
  oldImagePreview: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label: string;
  name: string;
  description: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const AvatarImageUploader = ({
                                      imagePreview,
                                      oldImagePreview,
                                      onChange,
                                      error,
                                      label,
                                      name,
                                      description,
                                      inputRef
                                    }: AvatarImageUploaderProps) => {
  return (
    <div className="mb-4.5">
      <div className="flex flex-col">
        <label className="text-body-sm font-medium text-dark dark:text-white">
          {label}
        </label>
        <p className="text-xs text-gray-500 mb-2">{description}</p>

        <div className="flex items-center mt-1">
          {/* Image preview */}
          {imagePreview && (
            <div className="relative mr-4">
              <img
                src={imagePreview}
                alt="Avatar preview"
                className="w-24 h-24 object-cover rounded-full border border-gray-300"
              />
            </div>
          )}

          {/* Upload button */}
          <div className="flex flex-col">
            <label
              htmlFor={name}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {imagePreview ? "Change Image" : "Upload Image"}
            </label>
            <input
              id={name}
              name={name}
              type="file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
              ref={inputRef}
            />
            {oldImagePreview && (
              <p className="text-xs text-gray-500 mt-2">The original image will be kept if no new image is uploaded.</p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};