import Dashboard from "@/components/ui/dashboard/dashboard-data";
import React from "react";

function page() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-2/3 flex items-center justify-center">
        <Dashboard />
      </div>
    </div>
  );
}

export default page;
