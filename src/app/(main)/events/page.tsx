"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import dynamic from "next/dynamic";
// import { EventTable } from "@/components/use-components/events/event-table";

const EventTable = dynamic(
  () =>
    import("@/components/use-components/events/event-table").then((mod) => ({
      default: mod.EventTable,
    })),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);

function Events() {
  return (
    <div>
      <Breadcrumb pageName="Event Management" />
      <EventTable />
    </div>
  );
}

export default Events;
