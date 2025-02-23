import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function GrafanaPanel({ title, data, setSelectedRange, selectedRange }) {
  const [chartData, setChartData] = useState({
    labels: [],
    fullLabels: [],
    datasets: []
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#D65600" }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return chartData.fullLabels && chartData.fullLabels[index]
              ? chartData.fullLabels[index]
              : "";
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#D65600" },
        grid: { color: "#333" }
      },
      y: {
        min: 0, // Set minimum intensity
        max: 100, // Set maximum intensity
        ticks: { color: "#D65600" },
        grid: { color: "#333" }
      }
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const simpleLabels = data.map(d =>
        new Date(d.time).toLocaleDateString()
      );
      const fullLabels = data.map(d =>
        new Date(d.time).toLocaleString()
      );
      setChartData({
        labels: simpleLabels,
        fullLabels,
        datasets: [
          {
            label: title,
            data: data.map(d => d.intensity || d.kpIndex || d.speed || 0),
            borderColor: "#D65600",
            backgroundColor: "rgba(214,86,0,0.2)",
            fill: true,
            tension: 0.4
          }
        ]
      });
    }
  }, [data, title]);

  return (
    <div className="bg-[#1a1a1a] p-4 shadow-md rounded-lg relative w-[80%] mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        
        {/* Hide range buttons if setSelectedRange is not provided (for future predictions) */}
        {setSelectedRange && (
          <div className="flex gap-2 mt-2">
            {["7", "14", "30", "90", "180"].map(range => (
              <button
                key={range}
                className={`px-3 py-1 text-xs rounded border transition ${
                  selectedRange === parseInt(range)
                    ? "bg-[#D65600] border-[#D65600] text-black"
                    : "border-[#D65600] bg-transparent text-[#D65600]"
                } hover:bg-[#D65600] hover:text-black hover:border-[#D65600]`}
                onClick={() => setSelectedRange(parseInt(range))}
              >
                {range === "7"
                  ? "7D"
                  : range === "14"
                  ? "14D"
                  : range === "30"
                  ? "1M"
                  : range === "90"
                  ? "3M"
                  : "6M"}
              </button>
            ))}
          </div>
        )}
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}
