"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";

function LineChart({x,y}) {
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  
  const [chart, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: x,
      },

      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [30, 100],
        },
      },

      dataLabels: {
        enabled: false,
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
      },
    },
    series: [
      {
        name: "series-1",
        data: y,

        color: "#460102",
      },
    ],
  });
  return (
    <div className="h-full">
      {typeof window !== "undefined" && (
        <Chart
          options={chart.options}
          series={chart.series}
          type="area"
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
}

export default LineChart;
