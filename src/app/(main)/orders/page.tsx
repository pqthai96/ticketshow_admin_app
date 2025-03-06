"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { OrderTable } from "@/components/use-components/orders/order-table";

function Orders() {
  return (
    <div>
      <Breadcrumb pageName="Order Management" />
      <OrderTable />
    </div>
  );
}

export default Orders;