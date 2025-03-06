import Image from "next/image";
import React from "react";

export const ImagePreview = ({ src, altText, className }: {src: any, altText: any, className?: any}) => {
  if (!src) return null;

  return (
    <div className="mt-2 relative w-full h-auto rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={altText}
        objectFit="cover"
        width={100}
        height={100}
        layout="responsive"
        className={className}
      />
    </div>
  );
};