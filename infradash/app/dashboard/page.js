"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SolarScene from "@/components/SolarScene";
import GrafanaPanel from "@/components/GrafanaPanel";

export default function Dashboard() {
  const [flareData, setFlareData] = useState([]);

  useEffect(() => {
    const data = [
      { time: "2025-01-22T11:08Z", intensity: 1.3 },
      { time: "2025-01-24T12:21Z", intensity: 9.8 },
      { time: "2025-01-24T21:04Z", intensity: 2.7 },
      { time: "2025-01-25T03:00Z", intensity: 3.7 },
      { time: "2025-01-25T03:23Z", intensity: 4.6 },
      { time: "2025-01-25T17:27Z", intensity: 5.4 },
    ];
    setFlareData(data);
  }, []);

  const solarEvents = [
    {
      time21_5: "2016-09-06T14:18Z",
      latitude: -20.0,
      longitude: 120.0,
      halfAngle: 31.0,
      speed: 674.0,
      type: "C",
    },
    {
      time21_5: "2016-09-15T04:24Z",
      latitude: -18.0,
      longitude: -122.0,
      halfAngle: 43.0,
      speed: 722.0,
      type: "C",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Solar Flare Dashboard</h1>
      <GrafanaPanel data={flareData} />

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">3D Interactive Sun</h2>
        <SolarScene />
      </div>
    </div>
  );
}
