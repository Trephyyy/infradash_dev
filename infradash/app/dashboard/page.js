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

  const [warnings, setWarnings] = useState([]);  // New state for future predictions
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
      setWarnings(data.warnings); // Set warnings data
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

          <motion.div className="w-full max-w-screen-xl " initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <CombinedGrafanaPanel title="Combined Solar Events Over Time" fetchData={fetchData} combinedRange={combinedRange} setCombinedRange={setCombinedRange} />
          </motion.div>

          {/* Horizontal Decorative Divider */}
          <motion.div 
            className="w-full h-[4px] bg-gradient-to-r from-orange-500 to-yellow-300 rounded-full shadow-lg mt-6"
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1 }}
          />

          <div className="grid grid-cols-1 gap-8 w-full max-w-screen-xl mt-8 items-center">
            <motion.div 
              className="h-[600px] flex justify-center w-full" // Centered and enlarged
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.3 }}
            >
              <GrafanaPanel 
                title="Solar Flare Intensity Over Time" 
                data={flareData} 
                setSelectedRange={setFlareRange} 
                selectedRange={flareRange} 
                borderColor="#FF4500" // Orange-red
                backgroundColor="rgba(255,69,0,0.2)" // Light orange-red
                buttonColor="#FF4500" // Orange-red
              />
            </motion.div>

            <motion.div 
              className="h-[600px] flex justify-center w-full" // Centered and enlarged
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.4 }}
            >
              <GrafanaPanel 
                title="Coronal Mass Ejections (CME) Over Time" 
                data={cmeData} 
                setSelectedRange={setCmeRange} 
                selectedRange={cmeRange} 
                borderColor="#1E90FF" // Dodger blue
                backgroundColor="rgba(30,144,255,0.2)" // Light dodger blue
                buttonColor="#1E90FF" // Dodger blue
              />
            </motion.div>
          </div>

          {/* Future Predictions Graph */}
          <motion.div className="w-full max-w-screen-xl mt-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <h2 className="text-3xl font-bold mb-4 tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
             AI Future Predictions ({futureRange} Days)
            </h2>
            <GrafanaPanel 
              title="Predicted Solar Activity Over Time" 
              data={futureData} 
              setSelectedRange={setFutureRange} 
              selectedRange={futureRange}
              borderColor="#32CD32" // Lime green
              backgroundColor="rgba(50,205,50,0.2)" // Light lime green
              buttonColor="#32CD32" // Lime green
            />          
          </motion.div>

          {/* Warnings for the next year */}
          <motion.div className="w-full max-w-screen-xl mt-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <h2 className="text-3xl font-bold mb-4 tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-500">
              Warnings for the Next Year
            </h2>
            <div className="bg-[#1a1a1a] p-4 shadow-md rounded-lg relative w-[80%] mx-auto text-white">
              {warnings.length > 0 ? (
                <ul>
                  {warnings.map((warning, index) => (
                    <li key={index} className={`mb-2 p-2 rounded ${warning.code === 'red' ? 'bg-red-500' : warning.code === 'orange' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                      <strong>{warning.code.toUpperCase()}:</strong> Severity {warning.severity} on {new Date(warning.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No warnings for the next year.</p>
              )}
            </div>
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
