"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { EventTable } from "@/components/use-components/events/event-table";

function Events() {

  return (
    <div>
      <Breadcrumb pageName="Events" />
      <EventTable/>
    </div>
  );
}

export default Events;