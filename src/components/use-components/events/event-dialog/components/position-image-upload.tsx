import React from "react";
import { ImageUploaderProps } from "../types";
import { BannerImageUploader } from "@/components/use-components/events/event-dialog/components/banner-image-upload";

export const PositionImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const defaultProps = {
    ...props,
    label: props.label || "Position Image",
    name: props.name || "positionImage",
    description: props.description || "Max size: 10MB"
  };

  return <BannerImageUploader {...defaultProps} />;
};