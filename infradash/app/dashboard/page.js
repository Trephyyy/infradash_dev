"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@grafana/ui";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const exampleServers = [
  {
    id: "Server 1",
    data: [
      { time: "10:00", temperature: 22, humidity: 55, power: 120, cpuUsage: 30, ramUsed: 4, diskUsed: 100 },
      { time: "10:05", temperature: 23, humidity: 54, power: 122, cpuUsage: 32, ramUsed: 4.2, diskUsed: 102 },
      { time: "10:10", temperature: 21, humidity: 56, power: 118, cpuUsage: 28, ramUsed: 4.1, diskUsed: 101 },
      { time: "10:15", temperature: 22, humidity: 57, power: 121, cpuUsage: 29, ramUsed: 4.3, diskUsed: 103 },
    ],
  },
  {
    id: "Server 2",
    data: [
      { time: "10:00", temperature: 25, humidity: 50, power: 130, cpuUsage: 35, ramUsed: 5, diskUsed: 110 },
      { time: "10:05", temperature: 24, humidity: 52, power: 128, cpuUsage: 34, ramUsed: 4.8, diskUsed: 108 },
      { time: "10:10", temperature: 26, humidity: 51, power: 132, cpuUsage: 36, ramUsed: 5.2, diskUsed: 112 },
      { time: "10:15", temperature: 27, humidity: 53, power: 135, cpuUsage: 38, ramUsed: 5.5, diskUsed: 115 },
    ],
  },
];

export default function Dashboard() {
  const [servers, setServers] = useState(exampleServers);

  useEffect(() => {
    const interval = setInterval(() => {
      setServers((prevServers) =>
        prevServers.map((server) => ({
          ...server,
          data: [
            ...server.data.slice(1),
            {
              time: new Date().toLocaleTimeString(),
              temperature: 20 + Math.random() * 5,
              humidity: 50 + Math.random() * 10,
              power: 110 + Math.random() * 15,
              cpuUsage: 20 + Math.random() * 50,
              ramUsed: 2 + Math.random() * 6,
              diskUsed: 100 + Math.random() * 10,
            },
          ],
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const combinedData = servers[0].data.map((_, index) => {
    const time = servers[0].data[index].time;
    const avgCpu = servers.reduce((sum, server) => sum + server.data[index].cpuUsage, 0) / servers.length;
    const avgRam = servers.reduce((sum, server) => sum + server.data[index].ramUsed, 0) / servers.length;
    const avgDisk = servers.reduce((sum, server) => sum + server.data[index].diskUsed, 0) / servers.length;
    return { time, avgCpu, avgRam, avgDisk };
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Smart Infrastructure Monitoring</h1>

      {/* Overview Section */}
      <h2 className="text-xl font-semibold mb-2">Overall Server Overview</h2>
      <LineChart width={800} height={300} data={combinedData} className="bg-white p-4 rounded-lg shadow mb-8">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="avgCpu" stroke="#ff0000" name="Avg CPU Usage (%)" />
        <Line type="monotone" dataKey="avgRam" stroke="#800080" name="Avg RAM Used (GB)" />
        <Line type="monotone" dataKey="avgDisk" stroke="#0000FF" name="Avg Disk Used (GB)" />
      </LineChart>

      {servers.map((server) => (
        <div key={server.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{server.id}</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold">CPU Usage</h2>
                <p className="text-2xl">{server.data[server.data.length - 1].cpuUsage.toFixed(1)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold">RAM Used</h2>
                <p className="text-2xl">{server.data[server.data.length - 1].ramUsed.toFixed(1)} GB</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold">Disk Used</h2>
                <p className="text-2xl">{server.data[server.data.length - 1].diskUsed.toFixed(1)} GB</p>
              </CardContent>
            </Card>
          </div>

          <LineChart width={800} height={300} data={server.data} className="bg-white p-4 rounded-lg shadow">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="#0088cc" name="Humidity (%)" />
            <Line type="monotone" dataKey="power" stroke="#00cc44" name="Power Usage (W)" />
            <Line type="monotone" dataKey="cpuUsage" stroke="#ff0000" name="CPU Usage (%)" />
            <Line type="monotone" dataKey="ramUsed" stroke="#800080" name="RAM Used (GB)" />
            <Line type="monotone" dataKey="diskUsed" stroke="#0000FF" name="Disk Used (GB)" />
          </LineChart>
        </div>
      ))}
      <Button className="mt-4" onClick={() => alert("Refreshing Data...")}>Refresh</Button>
    </div>
  );
}
