import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function CombinedGrafanaPanel({
  title,
  fetchData, // ✅ Ensure fetchData is passed as a prop
  combinedRange, // ✅ Ensure combinedRange is passed from the parent
  setCombinedRange, // ✅ Function to update the range for the combined graph
}) {
  // ✅ Independent state for combined graph data
  const [combinedFlareData, setCombinedFlareData] = useState([]);
  const [combinedCMEData, setCombinedCMEData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    fullLabels: [],
    datasets: [],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#D65600" },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return chartData.fullLabels && chartData.fullLabels[index]
              ? chartData.fullLabels[index]
              : "";
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#D65600", autoSkip: true, maxTicksLimit: 10 },
        grid: { color: "#333" },
      },
      y: {
        min: 0,
        max: 100,
        ticks: { color: "#D65600" },
        grid: { color: "#333" },
      },
    },
  };

  // ✅ Fetch data for the combined graph independently
  useEffect(() => {
    fetchData(combinedRange, "FLARE", setCombinedFlareData);
    fetchData(combinedRange, "CMES", setCombinedCMEData);
  }, [combinedRange, fetchData]);

  // ✅ Process data for the chart
  useEffect(() => {
    if (!combinedFlareData.length && !combinedCMEData.length) return;

    const timesSet = new Set();
    const addTimes = (data) => {
      data.forEach((item) => timesSet.add(item.time));
    };

    addTimes(combinedFlareData);
    addTimes(combinedCMEData);

    const sortedTimes = Array.from(timesSet).sort((a, b) => a - b);
    const labels = sortedTimes.map((time) =>
      new Date(time).toLocaleDateString()
    );
    const fullLabels = sortedTimes.map((time) =>
      new Date(time).toLocaleString()
    );

    const mapData = (data) => {
      const dataMap = {};
      data.forEach((item) => {
        dataMap[item.time] = item.intensity ?? null;
      });

      return sortedTimes.map((time) => dataMap[time] ?? null);
    };

    const mappedFlareData = mapData(combinedFlareData);
    const mappedCMEData = mapData(combinedCMEData);

    setChartData({
      labels,
      fullLabels,
      datasets: [
        {
          label: "Solar Flare",
          data: mappedFlareData,
          borderColor: "#D65600",
          backgroundColor: "rgba(214,86,0,0.2)",
          fill: false,
          spanGaps: true,
          tension: 0.4,
        },
        {
          label: "CME",
          data: mappedCMEData,
          borderColor: "#6b9bd1",
          backgroundColor: "rgba(209, 107, 107, 0.2)",
          fill: false,
          spanGaps: true,
          tension: 0.4,
        },
      ],
    });
  }, [combinedFlareData, combinedCMEData]);

  return (
    <div className="bg-[#1a1a1a] p-4 shadow-md rounded-lg relative w-[90%] mx-auto mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex gap-2 mt-2">
          {["7", "14", "30", "90", "365"].map((range) => (
            <button
              key={range}
              className={`px-3 py-1 text-xs rounded border transition ${
                combinedRange === parseInt(range)
                  ? "bg-[#D65600] border-[#D65600] text-black"
                  : "border-[#D65600] bg-transparent text-[#D65600]"
              } hover:bg-[#D65600] hover:text-black hover:border-[#D65600]`}
              onClick={() => setCombinedRange(parseInt(range))} // ✅ Change only the combined graph range
            >
              {range === "7"
                ? "7D"
                : range === "14"
                ? "14D"
                : range === "30"
                ? "1M"
                : range === "90"
                ? "3M"
                : "1Y"}
            </button>
          ))}
        </div>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}
