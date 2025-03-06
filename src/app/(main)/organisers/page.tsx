"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { OrganiserTable } from "@/components/use-components/organisers/organiser-table";

function Organisers() {
  return (
    <div>
      <Breadcrumb pageName="Organiser Management" />
      <OrganiserTable />
    </div>
  );
}

export default Organisers;