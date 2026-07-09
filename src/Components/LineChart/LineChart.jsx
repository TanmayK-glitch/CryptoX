import React from "react";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center h-[400px] w-full border border-neutral-100 rounded-xl bg-neutral-50/50">
    <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin mb-3"></div>
    <p className="text-neutral-400 font-medium text-sm">Loading chart data...</p>
  </div>
);

const LineChart = ({ historicalData }) => {
  const prices = historicalData?.prices;

  if (!Array.isArray(prices) || prices.length === 0) {
    return <LoadingFallback />;
  }

  const data = prices.map(([timestamp, price]) => {
    const d = new Date(timestamp);
    return { date: `${d.getMonth() + 1}/${d.getDate()}`, price };
  });

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e5e5e5" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#737373", fontSize: 12 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5" }}
            labelStyle={{ color: "#171717", fontWeight: 600 }}
          />
          <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={false} />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;