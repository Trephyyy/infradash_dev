"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SolarScene from "@/components/SolarScene";
import GrafanaPanel from "@/components/GrafanaPanel";
import CombinedGrafanaPanel from "@/components/CombinedGrafanaPanel";
import { motion } from "framer-motion";
import Head from "next/head";

export default function Dashboard() {
  const router = useRouter();

  const [flareData, setFlareData] = useState([]);
  const [cmeData, setCmeData] = useState([]);
  const [futureData, setFutureData] = useState([]);  // New state for future predictions
  const [loading, setLoading] = useState(false);

  const [warnings, setWarnings] = useState("No warnings");  // New state for future predictions
  const [flareRange, setFlareRange] = useState(30);
  const [cmeRange, setCmeRange] = useState(30);
  const [futureRange, setFutureRange] = useState(30);  // New state for future predictions
  const [combinedRange, setCombinedRange] = useState(30);

  // Fetch past event data
  const fetchData = async (rangeDays, eventType, setData) => {
    setLoading(true);
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - rangeDays);
      const startDateStr = start.toISOString().split("T")[0];
      const endDateStr = end.toISOString().split("T")[0];

      const url = `https://api.infradash.space/api/donki/search?startDate=${startDateStr}&endDate=${endDateStr}&eventType=${eventType}`;
      const res = await fetch(url);
      const data = await res.json();

      const eventsArray = Array.isArray(data) ? data : [data];
      const processedData = eventsArray.map((item) => ({
        ...item,
        time: new Date(item.peak_time || item.start_time || item.cmeTime).getTime(),
        intensity: item.intensity || item.kpIndex || item.speed || item.magnitude || 0,
      }));
      setData(processedData);
    } catch (error) {
      console.error(`Error fetching ${eventType} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch future prediction data with respect to futureRange
  const fetchFutureData = async () => {
    try {
      const url = `https://api.infradash.space/predict?days=${futureRange}`;
      const res = await fetch(url);
      const data = await res.json();
  
      const processedData = data.data.map((item) => ({
        time: new Date(item.Timestamp).getTime(),
        intensity: item.Severity,
      }));
      console.log('Fetched future data:', processedData);
      setFutureData(processedData);
      setWarnings(data.warnings); // Assuming warnings are handled
    } catch (error) {
      console.error("Error fetching future predictions:", error);
    }
  };

  // Fetch data for the specific time ranges
  useEffect(() => {
    fetchData(flareRange, "FLARE", setFlareData);
  }, [flareRange]);

  useEffect(() => {
    fetchData(cmeRange, "CMES", setCmeData);
  }, [cmeRange]);

  useEffect(() => {
    fetchData(combinedRange, "FLARE", setFlareData);
    fetchData(combinedRange, "CMES", setCmeData);
  }, [combinedRange]);

  // Fetch future data when futureRange changes
  useEffect(() => {
    fetchFutureData();  // Fetch future predictions on time frame change
}, [futureRange]);

  return (
    <>
      <Head>
        <title>Solar Event Dashboard</title>
        <meta name="description" content="Monitor solar flares, coronal mass ejections (CME), and predictions for solar activity. Stay up to date with real-time solar event data." />
      </Head>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.6 }}
        className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center"
      >
        <div className="max-w-screen-xl w-full relative">
          <h1 className="text-5xl font-extrabold mb-8 tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">
            Solar Event Dashboard
          </h1>

          <motion.div className="w-full max-w-screen-xl h-[800px]" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <CombinedGrafanaPanel title="Combined Solar Events Over Time" fetchData={fetchData} combinedRange={combinedRange} setCombinedRange={setCombinedRange} />
          </motion.div>

          {/* Horizontal Decorative Divider */}
          <motion.div 
            className="w-full h-[4px] bg-gradient-to-r from-orange-500 to-yellow-300 rounded-full shadow-lg mt-6"
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 w-full max-w-screen-xl mt-8 items-center">
            <motion.div 
              className="h-[700px] flex justify-end w-full md:w-[45%]" // Adjusted width
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.3 }}
            >
              <GrafanaPanel title="Solar Flare Intensity Over Time" data={flareData} setSelectedRange={setFlareRange} selectedRange={flareRange} />
            </motion.div>

            <div className="hidden md:flex flex-col items-center justify-center w-[5px]">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full shadow-2xl ring-4 ring-orange-500/30 animate-pulse"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <motion.div 
                className="h-[650px] w-[3px] bg-gradient-to-b from-orange-500 to-yellow-300 rounded-full shadow-lg mt-0"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>

            <motion.div 
              className="h-[700px] flex justify-start w-full md:w-[45%]" // Adjusted width
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.4 }}
            >
              <GrafanaPanel title="Coronal Mass Ejections (CME) Over Time" data={cmeData} setSelectedRange={setCmeRange} selectedRange={cmeRange} />
            </motion.div>
            <div>
              { warnings }
            </div>
          </div>

          {/* Future Predictions Graph */}
          <motion.div className="w-full max-w-screen-xl mt-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <h2 className="text-3xl font-bold mb-4 tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Future Predictions ({futureRange} Days)
            </h2>
            <GrafanaPanel title="Predicted Solar Activity Over Time" data={futureData} setSelectedRange={setFutureRange} selectedRange={futureRange}/>          
          </motion.div>

          <motion.div className="w-full max-w-screen-xl mt-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <h2 className="text-3xl font-bold mb-4 tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">
              3D Interactive Flare Position On The Sun
            </h2>
            <SolarScene />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
