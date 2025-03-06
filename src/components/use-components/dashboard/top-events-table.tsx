"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/api-client/api-client";
import { cn } from "@/lib/use-lib/utils";
import { standardFormat } from "@/lib/use-lib/format-number";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

type TopEvent = {
  eventId: number;
  eventName: string;
  revenue: number;
  ticketsSold: number;
};

type TopEventsData = {
  topEvents: TopEvent[];
  timeFrame: string;
};

export function TopEventsTable({
                                       timeFrame = "monthly",
                                       className,
                                     }: PropsType) {
  const [data, setData] = useState<TopEventsData>({
    topEvents: [],
    timeFrame: timeFrame
  });

  useEffect(() => {
    axiosClient.get(`/statistics/top-events?timeFrame=${timeFrame}&limit=5`)
      .then((response: any) => setData(response))
      .catch(error => console.error("Error fetching top events:", error));
  }, [timeFrame]);

  console.log(data);

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-5 py-5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Top Events by Revenue
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Highest performing events during the monthly period
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Event Name
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Revenue
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Tickets Sold
            </th>
          </tr>
          </thead>
          {data.topEvents && data.topEvents.length > 0 ? (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.topEvents.map((event: TopEvent) => (
              <tr key={event.eventId}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {event.eventName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                  ${typeof event.revenue === 'number' ? standardFormat(event.revenue) : '0.00'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                  {event.ticketsSold ? event.ticketsSold.toLocaleString() : '0'}
                </td>
              </tr>
            ))}
            </tbody>
          ) : (
            <tbody>
            <tr>
              <td colSpan={3} className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No event data available for this period</p>
              </td>
            </tr>
            </tbody>
          )}
        </table>
      </div>

      {data.topEvents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No event data available for this period</p>
        </div>
      )}
    </div>
  );
}