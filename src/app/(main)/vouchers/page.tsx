"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VoucherTable } from "@/components/use-components/vouchers/voucher-table";

function Vouchers() {
  return (
    <div>
      <Breadcrumb pageName="Voucher Management" />
      <VoucherTable />
    </div>
  );
}

export default Vouchers;