"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axiosClient from "@/api-client/api-client";
import { standardFormat } from "@/lib/use-lib/format-number";
import { cn } from "@/lib/use-lib/utils";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

type RevenueDistributionData = {
  ticketSales: { x: string; y: number }[];
  seatSales: { x: string; y: number }[];
  totalTicketRevenue: number;
  totalSeatRevenue: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalSeatsSold: number;
};

export function RevenueDistributionCard({
                                                timeFrame = "monthly",
                                                className,
                                              }: PropsType) {

  const [data, setData] = useState<RevenueDistributionData>({
    ticketSales: [],
    seatSales: [],
    totalTicketRevenue: 0,
    totalSeatRevenue: 0,
    totalRevenue: 0,
    totalTicketsSold: 0,
    totalSeatsSold: 0
  });

  useEffect(() => {
    axiosClient.get(`statistics/sales/by-type?timeFrame=${timeFrame}`)
      .then((response: any) => setData(response))
      .catch(error => console.error("Error fetching revenue distribution:", error));
  }, [timeFrame]);

  const pieData = data ? [
    { name: 'Ticket Sales', value: data.totalTicketRevenue || 0 },
    { name: 'Seat Sales', value: data.totalSeatRevenue || 0 },
  ] : [];

  const COLORS = ['#8884d8', '#82ca9d'];

  // Custom formatter cho tooltip
  const customFormatter = (value: any) => {
    if (typeof value === 'number') {
      return `$${standardFormat(value)}`;
    }
    return '$0.00';
  };

  const renderCustomizedLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-5 py-5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        Revenue Distribution
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={customFormatter} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-md bg-indigo-50 p-2 dark:bg-indigo-900/20">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="font-bold text-dark dark:text-white">
            ${typeof data.totalRevenue === 'number' ? standardFormat(data.totalRevenue) : '0.00'}
          </p>
        </div>
        <div className="rounded-md bg-green-50 p-2 dark:bg-green-900/20">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Tickets/Seats</p>
          <p className="font-bold text-dark dark:text-white">
            {(data.totalTicketsSold + data.totalSeatsSold).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}