"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UserTable } from "@/components/use-components/users/user-table";

function Users() {

  return (
    <div>
      <Breadcrumb pageName="User Management" />
      <UserTable/>
    </div>
  );
}

export default Users;