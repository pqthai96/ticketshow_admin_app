"use client";

import React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { standardFormat } from "@/lib/use-lib/format-number";

type DataPoint = {
  x: string;
  y: number;
};

type EventSalesChartProps = {
  ticketData: DataPoint[];
  seatData: DataPoint[];
};

export function EventSalesChart({ ticketData, seatData }: EventSalesChartProps) {
  // Prepare data for recharts
  const chartData = ticketData.map((point, index) => ({
    name: point.x,
    'Ticket Sales': point.y,
    'Seat Sales': seatData[index]?.y || 0,
  }));

  // Custom formatter for tooltips that correctly handles number conversion
  const customFormatter = (value: number | string | Array<number | string> | undefined) => {
    if (typeof value === 'number') {
      return [`$${standardFormat(value)}`, undefined];
    }
    return ['$0.00', undefined];
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={customFormatter} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Ticket Sales"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Seat Sales"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}