"use client";

import React, { useEffect, useState } from "react";
import { PeriodPicker } from "@/components/period-picker";
import { EventSalesChart } from "@/components/use-components/dashboard/event-sales-chart";
import axiosClient from "@/api-client/api-client";
import { cn } from "@/lib/use-lib/utils";
import { standardFormat } from "@/lib/use-lib/format-number";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

type DataPoint = {
  x: string;
  y: number;
};

type SalesData = {
  ticketSales: DataPoint[];
  seatSales: DataPoint[];
  totalTicketRevenue: number;
  totalSeatRevenue: number;
  totalTicketsSold: number;
  totalSeatsSold: number;
  salesTrend: {
    growthRates?: number[];
    averageGrowthRate?: number;
    ticketSalesPercentage: number;
    seatSalesPercentage: number;
  };
};

export function EventSalesOverview({
                                     timeFrame = "monthly",
                                     className,
                                   }: PropsType) {
  const [data, setData] = useState<SalesData>({
    ticketSales: [],
    seatSales: [],
    totalTicketRevenue: 0,
    totalSeatRevenue: 0,
    totalTicketsSold: 0,
    totalSeatsSold: 0,
    salesTrend: {
      ticketSalesPercentage: 0,
      seatSalesPercentage: 0
    }
  });

  useEffect(() => {
    axiosClient.get(`statistics/sales/overview?timeFrame=${timeFrame}`)
      .then((response) => {
        setData(response.data || response);
      })
      .catch(error => console.error("Error fetching sales data:", error));
  }, [timeFrame]);

  return (
    <div
      className={cn(
        "grid gap-4 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-dark dark:text-white">
          Event Sales Overview
        </h2>

        <PeriodPicker
          defaultValue={timeFrame}
          sectionKey="event_sales"
          items={["daily", "weekly", "monthly", "yearly"]}
        />
      </div>

      <EventSalesChart
        ticketData={data?.ticketSales || []}
        seatData={data?.seatSales || []}
      />

      <dl className="grid divide-y divide-gray-200 dark:divide-gray-700 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="px-4 py-3 text-center">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Ticket Revenue
          </dt>
          <dd className="mt-1 text-xl font-semibold text-dark dark:text-white">
            ${standardFormat(data?.totalTicketRevenue || 0)}
          </dd>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {(data?.totalTicketsSold || 0).toLocaleString()} tickets sold
          </p>
        </div>
        <div className="px-4 py-3 text-center">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Seat Revenue
          </dt>
          <dd className="mt-1 text-xl font-semibold text-dark dark:text-white">
            ${standardFormat(data?.totalSeatRevenue || 0)}
          </dd>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {(data?.totalSeatsSold || 0).toLocaleString()} seats sold
          </p>
        </div>
      </dl>
    </div>
  );
}