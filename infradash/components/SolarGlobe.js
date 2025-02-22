"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("globe.gl").then((mod) => mod.default), {
  ssr: false, 
  loading: () => <p>Loading globe...</p>,
});

const SolarGlobe = ({ data }) => {
  const globeRef = useRef(null);
  const globeInstance = useRef(null);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);

  useEffect(() => {
    if (!globeRef.current || globeInstance.current) return;

    console.log("✅ Globe container found, initializing...");

    import("globe.gl").then((Globe) => {
      globeInstance.current = Globe.default(globeRef.current);
      console.log("✅ Globe instance created:", globeInstance.current);

      // ✅ Set NASA's latest Sun image as the texture
      globeInstance.current.globeImageUrl("/sun.jpg");

      


      // Set black background (space effect)
      globeInstance.current.backgroundColor("#000");

      // Adjust camera to avoid being too close
      globeInstance.current.pointOfView({ lat: 0, lng: 0, altitude: 5 });


      // Add solar event data
      globeInstance.current.labelsData(data)
        .labelLat(d => d.latitude)
        .labelLng(d => d.longitude)
        .labelText(d => `${d.time21_5}\nSpeed: ${d.speed} km/s`)
        .labelSize(1.5)
        .labelColor(() => "red")
        .labelResolution(2);

      console.log("✅ Labels added:", data);
      setIsGlobeLoaded(true);
    });

  }, [data]);

  return (
    <div className="relative w-full h-[500px] bg-black">
      {!isGlobeLoaded && <p className="text-white text-center">Loading Globe...</p>}
      <div ref={globeRef} style={{ width: "100%", height: "500px", minHeight: "500px" }}></div>
    </div>
  );
};

export default SolarGlobe;
