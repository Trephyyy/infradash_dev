"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Learn() {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
      className="p-4 sm:p-6 min-h-screen relative overflow-hidden text-white flex flex-col items-center"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-[-2]" />
      <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-20 z-[-1]" />
      <div className="absolute inset-0 animate-pulse bg-opacity-30 backdrop-blur-xl z-[-1]" />

      {/* Floating Stars Animation */}
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <div className="w-full h-full bg-[url('/images/stars.webp')] opacity-50 animate-[moveStars_30s_linear_infinite]" />
      </div>

      <div className="max-w-screen-lg w-full relative">
        {/* Home Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 sm:px-5 py-2 rounded-lg border border-[#D65600] bg-opacity-30 backdrop-blur-lg text-[#D65600] transition-all duration-300 hover:bg-[#D65600] hover:text-black"
          >
            Home
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 sm:mb-8 tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">
          Learn About Solar Storms
        </h1>

        {/* Introduction */}
        <motion.div 
          className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-lg sm:text-xl leading-relaxed text-gray-300"
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          <p className="mb-4">
            Solar storms are powerful bursts of energy from the Sun that can impact Earth’s magnetic field, causing disruptions to satellites, power grids, and even communication networks.
          </p>
          <p className="mb-4">
            The main types of solar storms are <span className="text-orange-400 font-semibold">Solar Flares</span> and <span className="text-orange-400 font-semibold">Coronal Mass Ejections (CMEs)</span>. 
            These events release huge amounts of energy, sometimes strong enough to affect technology and infrastructure on Earth.
          </p>

          {/* Image - Solar Storm */}
          <div className="flex justify-center my-6">
            <Image 
              src="/images/solar-storm.webp" 
              alt="Solar Storm Eruption" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-lg"
            />
          </div>

          <p className="mb-4">
            One of the most famous solar storms occurred in <span className="text-yellow-400 font-semibold">1989</span>, causing a major power blackout in Canada. 
            Scientists have since been studying solar activity to improve predictions and minimize risks.
          </p>

          {/* How It Affects Us */}
          <h2 className="text-2xl sm:text-3xl font-bold my-6 text-orange-400">
            How Do Solar Storms Affect Us?
          </h2>

          {/* Power Grids */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <Image 
              src="/images/power-grid.webp" 
              alt="Power Grid Failure" 
              width={300} 
              height={200} 
              className="rounded-lg shadow-lg"
            />
            <div>
              <h3 className="text-xl font-semibold text-yellow-400">🔌 Power Grid Failures</h3>
              <p>
                Intense solar storms can cause **power grid failures**, leading to blackouts that affect millions. 
                The 1989 solar storm knocked out power in **Québec, Canada**, for over **9 hours**.
              </p>
            </div>
          </div>

          {/* Satellites & GPS */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <Image 
              src="/images/satellite.webp" 
              alt="Satellite Disruption" 
              width={300} 
              height={200} 
              className="rounded-lg shadow-lg"
            />
            <div>
              <h3 className="text-xl font-semibold text-yellow-400">📡 Satellite & GPS Disruptions</h3>
              <p>
                High-energy particles from the Sun can **damage satellites**, causing communication breakdowns and 
                GPS navigation errors. Airplane pilots and military operations rely on accurate GPS, making these 
                disruptions highly problematic.
              </p>
            </div>
          </div>

          {/* Internet & Technology */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <Image 
              src="/images/internet.webp" 
              alt="Internet Outage" 
              width={300} 
              height={200} 
              className="rounded-lg shadow-lg"
            />
            <div>
              <h3 className="text-xl font-semibold text-yellow-400">🌍 Internet & Technology Failures</h3>
              <p>
                Solar storms can interfere with **underwater internet cables**, affecting global internet speed 
                and reliability. **Banking systems, cloud storage, and streaming services** could all be impacted.
              </p>
            </div>
          </div>

          {/* Prediction Limitations */}
          <h2 className="text-2xl sm:text-3xl font-bold my-6 text-red-400">
            Can We Predict Solar Storms?
          </h2>
          <p className="mb-4">
            Predicting solar storms is <span className="text-red-400 font-semibold">extremely difficult</span>. The Sun's activity is chaotic, and while scientists use AI and past data, **no forecast is 100% accurate**.
          </p>
          <p className="mb-4">
            Our website predicts solar storms using data from <span className="text-yellow-400 font-semibold">1989</span> onwards, analyzing patterns to estimate future events. 
            These predictions **help raise awareness**, but should not be relied on as absolute forecasts.
          </p>

          {/* Final Image - Solar Weather Monitoring */}
          <div className="flex justify-center my-6">
            <Image 
              src="/images/space_weather.webp" 
              alt="Space Weather Monitoring" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-lg"
            />
          </div>

          <p className="text-center text-gray-400 italic">
            *Scientists continuously improve solar storm predictions using AI, satellites, and solar observatories.*
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
