"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FeedbackTable } from "@/components/use-components/feedbacks/feedback-table";

function Feedbacks() {
  return (
    <div>
      <Breadcrumb pageName="Feedback Management" />
      <FeedbackTable />
    </div>
  );
}

export default Feedbacks;