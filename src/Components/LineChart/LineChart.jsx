import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

const LineChart = ({ historicalData }) => {
  const [chartData, setChartData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Reset state on new data
    setChartData(null);
    setIsReady(false);

    // 2. Validate data
    const prices = historicalData?.prices;
    if (!Array.isArray(prices) || prices.length === 0) return;

    // 3. Format data safely
    const formatted = [["Date", "Price"]];
    prices.forEach((entry) => {
      if (Array.isArray(entry) && entry.length >= 2) {
        const d = new Date(entry[0]);
        formatted.push([`${d.getMonth() + 1}/${d.getDate()}`, entry[1]]);
      }
    });

    if (formatted.length <= 1) return;

    // 4. Set data and use a safe timeout before rendering the Chart
    setChartData(formatted);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 250); // 250ms delay gives the external Google script time to initialize

    return () => clearTimeout(timer);
  }, [historicalData]);

  const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center h-[400px] w-full border border-neutral-100 rounded-xl bg-neutral-50/50">
      <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin mb-3"></div>
      <p className="text-neutral-400 font-medium text-sm">Loading chart data...</p>
    </div>
  );

  if (!chartData || !isReady) {
    return <LoadingFallback />;
  }

  return (
    <div className="w-full h-[400px]">
      <Chart
        chartType="LineChart"
        width="100%"
        height="100%"
        data={chartData}
        loader={<LoadingFallback />}
        options={{
          backgroundColor: "transparent",
          colors: ["#2563eb"],
          legend: { position: "none" },
          chartArea: { width: "85%", height: "80%" },
          curveType: "function",
          hAxis: {
            textStyle: { color: "#737373" },
            gridlines: { color: "transparent" },
            baselineColor: "transparent",
          },
          vAxis: {
            textStyle: { color: "#737373" },
            gridlines: { color: "#e5e5e5" },
            baselineColor: "transparent",
          },
          animation: {
            startup: true,
            easing: "out",
            duration: 500,
          },
        }}
      />
    </div>
  );
};

export default LineChart;
