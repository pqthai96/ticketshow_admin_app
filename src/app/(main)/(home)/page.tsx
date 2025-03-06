import { Suspense } from "react";
import { createTimeFrameExtractor } from "@/lib/use-lib/timeframe-extractor";
import { EventSalesOverview } from "@/components/use-components/dashboard/event-sales-overview";
import { SalesTrendCard } from "@/components/use-components/dashboard/sales-trend-card";
import { RevenueDistributionCard } from "@/components/use-components/dashboard/revenue-distribution-card";
import { TopEventsTable } from "@/components/use-components/dashboard/top-events-table";

// Skeleton components for loading states
const EventSalesOverviewSkeleton = () => (
  <div className="col-span-12 xl:col-span-8 animate-pulse rounded-[10px] bg-gray-100 h-80 dark:bg-gray-800"></div>
);

const CardSkeleton = () => (
  <div className="col-span-12 xl:col-span-4 animate-pulse rounded-[10px] bg-gray-100 h-64 dark:bg-gray-800"></div>
);

const TableSkeleton = () => (
  <div className="col-span-12 xl:col-span-8 animate-pulse rounded-[10px] bg-gray-100 h-96 dark:bg-gray-800"></div>
);

type PropsType = {
  searchParams: {
    selected_time_frame?: string;
  };
};

export default function Home({ searchParams }: PropsType) {
  const { selected_time_frame = 'monthly' } = searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-white">
          Event Sales Statistics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your event ticket and seat sales performance
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <Suspense fallback={<EventSalesOverviewSkeleton />}>
          <EventSalesOverview
            className="col-span-12 xl:col-span-8"
            key={extractTimeFrame("event_sales")}
            timeFrame={extractTimeFrame("event_sales")?.split(":")[1] || selected_time_frame}
          />
        </Suspense>

        <Suspense fallback={<CardSkeleton />}>
          <SalesTrendCard
            className="col-span-12 xl:col-span-4"
            key={extractTimeFrame("sales_trend")}
            timeFrame={extractTimeFrame("sales_trend")?.split(":")[1] || selected_time_frame}
          />
        </Suspense>

        <Suspense fallback={<CardSkeleton />}>
          <RevenueDistributionCard
            className="col-span-12 xl:col-span-4"
            key={extractTimeFrame("revenue_distribution")}
            timeFrame={extractTimeFrame("revenue_distribution")?.split(":")[1] || selected_time_frame}
          />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <TopEventsTable
            className="col-span-12 xl:col-span-8"
            key={extractTimeFrame("top_events")}
            timeFrame={extractTimeFrame("top_events")?.split(":")[1] || selected_time_frame}
          />
        </Suspense>
      </div>
    </>
  );
}