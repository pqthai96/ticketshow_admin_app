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

async function getSalesStatistics(timeFrame: string): Promise<SalesData> {
  const response = await fetch(`/api/statistics/sales/overview?timeFrame=${timeFrame}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales statistics');
  }

  return response.json();
}