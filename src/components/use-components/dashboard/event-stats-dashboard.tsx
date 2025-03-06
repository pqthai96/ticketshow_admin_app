import React from 'react';
import { EventSalesOverview } from "@/components/use-components/dashboard/event-sales-overview";
import { SalesTrendCard } from "@/components/use-components/dashboard/sales-trend-card";
import { RevenueDistributionCard } from "@/components/use-components/dashboard/revenue-distribution-card";
import { TopEventsTable } from "@/components/use-components/dashboard/top-events-table";

type PropsType = {
  searchParams: {
    selected_time_frame?: string;
  };
};

export default async function EventStatsDashboard({ searchParams }: PropsType) {
  const { selected_time_frame = 'monthly' } = searchParams;

  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <EventSalesOverview
          className="col-span-12 xl:col-span-8"
          timeFrame={selected_time_frame}
        />

        <SalesTrendCard
          className="col-span-12 xl:col-span-4"
          timeFrame={selected_time_frame}
        />

        <RevenueDistributionCard
          className="col-span-12 xl:col-span-4"
          timeFrame={selected_time_frame}
        />

        <TopEventsTable
          className="col-span-12 xl:col-span-8"
          timeFrame={selected_time_frame}
        />
      </div>
    </>
  );
}