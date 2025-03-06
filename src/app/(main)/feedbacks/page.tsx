"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import dynamic from "next/dynamic";

const FeedbackTable = dynamic(
  () =>
    import("@/components/use-components/feedbacks/feedback-table").then((mod) => ({
      default: mod.FeedbackTable,
    })),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);

function Feedbacks() {
  return (
    <div>
      <Breadcrumb pageName="Feedback Management" />
      <FeedbackTable />
    </div>
  );
}

export default Feedbacks;