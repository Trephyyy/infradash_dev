'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function GrafanaPanel({ data }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (data.length > 0) {
      setChartData({
        labels: data.map(d => new Date(d.time).toLocaleString()),
        datasets: [
          {
            label: 'Solar Flare Intensity',
            data: data.map(d => d.intensity),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4
          }
        ]
      });
    }
  }, [data]);

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Solar Flare Intensity Over Time</h2>
      <Line data={chartData} />
    </div>
  );
}
