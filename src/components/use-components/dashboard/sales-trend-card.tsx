"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axiosClient from "@/api-client/api-client";
import { cn } from "@/lib/use-lib/utils";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

type SalesData = {
  ticketSales: { x: string; y: number }[];
  seatSales: { x: string; y: number }[];
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

export function SalesTrendCard({
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
      growthRates: [],
      averageGrowthRate: 0,
      ticketSalesPercentage: 0,
      seatSalesPercentage: 0
    }
  });

  useEffect(() => {
    axiosClient.get(`/statistics/sales/overview?timeFrame=${timeFrame}`)
      .then((response: any) => setData(response))
      .catch(error => console.error("Error fetching sales trend:", error));
  }, [timeFrame]);

// Safe access to nested properties
  const trend = data?.salesTrend || {
    growthRates: [],
    averageGrowthRate: 0,
    ticketSalesPercentage: 0,
    seatSalesPercentage: 0
  };

  const growthData = trend?.growthRates?.map((rate, index) => ({
    period: index + 1,
    rate: rate
  })) || [];

  const formatGrowthRate = (rate?: number) => {
    if (rate === undefined) return 'N/A';
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(2)}%`;
  };

  const averageGrowthRate = trend.averageGrowthRate ?? 0;

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-5 py-5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">
        Sales Growth Trend
      </h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Average Growth Rate
        </span>
        <span className={cn(
          "text-lg font-bold",
          typeof averageGrowthRate === 'number' && averageGrowthRate >= 0 ? "text-green-500" : "text-red-500"
        )}>
          {formatGrowthRate(averageGrowthRate)}
        </span>
      </div>

      {growthData.length > 0 && (
        <div className="h-40 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <XAxis dataKey="period" />
              <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-indigo-50 p-2 dark:bg-indigo-900/20">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">Ticket Sales</p>
          <p className="text-center font-bold text-indigo-600 dark:text-indigo-400">
            {trend.ticketSalesPercentage?.toFixed(1) || '0.0'}%
          </p>
        </div>
        <div className="rounded-md bg-green-50 p-2 dark:bg-green-900/20">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">Seat Sales</p>
          <p className="text-center font-bold text-green-600 dark:text-green-400">
            {trend.seatSalesPercentage?.toFixed(1) || '0.0'}%
          </p>
        </div>
      </div>
    </div>
  );
}