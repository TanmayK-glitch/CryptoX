import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

const LineChart = ({ historicalData }) => {
  const [data, setData] = useState([["Date", "Price"]]);

  useEffect(() => {
    let dataCopy = [["Date", "Price"]];

    const pricesArray = historicalData?.prices
      ? historicalData.prices
      : Array.isArray(historicalData) ? historicalData : [];

    if (pricesArray.length > 0) {
      pricesArray.forEach((item) => {
        const date = new Date(item[0]);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        dataCopy.push([formattedDate, item[1]]);
      });
      setData(dataCopy);
    }
  }, [historicalData]);

  const options = {
    backgroundColor: "transparent",
    colors: ["#2563eb"],
    legend: { position: "none" },
    chartArea: { width: "85%", height: "80%" },
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
  };

  if (!historicalData || data.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] w-full border border-neutral-100 rounded-xl bg-neutral-50/50">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin mb-3"></div>
        <p className="text-neutral-400 font-medium text-sm">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <Chart
        chartType="LineChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
      />
    </div>
  );
};

export default LineChart;
