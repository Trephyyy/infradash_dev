"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

// 🌞 Solar Event Data
const solarEvents = [
  {
    time21_5: "2016-09-06T14:18Z",
    latitude: -20.0,
    longitude: 120.0,
    speed: 674.0,
    type: "C",
  },
  {
    time21_5: "2016-09-15T04:24Z",
    latitude: -18.0,
    longitude: -122.0,
    speed: 722.0,
    type: "C",
  },
];

// 🌞 Sun Component
const Sun = ({ onHover, isHovered }) => {
  const sunRef = useRef();

  // 🔄 Rotate the Sun continuously unless hovered
  useFrame(() => {
    if (sunRef.current && !isHovered) {
      sunRef.current.rotation.y += 0.002;
    }
  });

  // ☀️ Load Sun texture
  const sunTexture = new THREE.TextureLoader().load("/sun.jpg", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
  });

  return (
    <mesh ref={sunRef} rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
        map={sunTexture}
        emissiveMap={sunTexture}
        emissive={new THREE.Color("#ff8c00")}
        emissiveIntensity={2}
        roughness={0.1}
        side={THREE.DoubleSide}
      />

      {/* 🔥 Glowing Halo */}
      <mesh>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshBasicMaterial color={"orange"} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* 🌍 Solar Event Points */}
      <SolarEventMarkers data={solarEvents} onHover={onHover} />
    </mesh>
  );
};

// 🟢 Solar Event Markers (Points on the Sun)
const SolarEventMarkers = ({ data, onHover }) => {
  const { camera, size } = useThree();
  const [hovered, setHovered] = useState(null);

  const positions = useMemo(() => {
    return data.map((event) => {
      const latRad = (event.latitude * Math.PI) / 180;
      const lonRad = (event.longitude * Math.PI) / 180;
      const radius = 3.05; // Slightly above the surface

      return {
        position: new THREE.Vector3(
          radius * Math.cos(latRad) * Math.cos(lonRad),
          radius * Math.sin(latRad),
          radius * Math.cos(latRad) * Math.sin(lonRad)
        ),
        data: event,
      };
    });
  }, [data]);

  return (
    <group>
      {positions.map((event, index) => (
        <mesh
          key={index}
          position={event.position}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(event);
            // Convert 3D position to 2D screen position
            const vector = event.position.clone().project(camera);
            const x = ((vector.x + 1) / 2) * size.width;
            const y = ((1 - vector.y) / 2) * size.height;
            onHover(event.data, x, y);
          }}
          onPointerOut={() => {
            setHovered(null);
            onHover(null, 0, 0);
          }}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={hovered ? "yellow" : "red"} />
        </mesh>
      ))}
    </group>
  );
};

// 🌌 Full Solar Scene (Moved useThree inside Canvas)
const SceneWrapper = ({ onHover, isHovered }) => {
  return (
    <Canvas style={{ width: "100%", height: "500px", background: "black" }}>
      <Stars radius={300} depth={50} count={5000} factor={4} />
      <Sun onHover={onHover} isHovered={isHovered} />
      <pointLight position={[10, 10, 10]} intensity={5} />
      <ambientLight intensity={1.5} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

// 🚀 Main Component with Tooltip Handling
const SolarScene = () => {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 🛠️ Updates tooltip when hovering over points
  const handleHover = (eventData, x, y) => {
    if (eventData) {
      setHoveredEvent(eventData);
      setTooltipPos({ x, y });
      setIsHovered(true);
    } else {
      setHoveredEvent(null);
      setIsHovered(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* 🏷️ Tooltip for Solar Events */}
      {hoveredEvent && (
        <div
          style={{
            position: "absolute",
            top: tooltipPos.y + "px",
            left: tooltipPos.x + "px",
            padding: "10px",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            borderRadius: "5px",
            fontSize: "14px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 10,
            transform: "translate(-50%, -50%)",
          }}
        >
          <strong>Solar Flare</strong>
          <p><strong>Time:</strong> {hoveredEvent.time21_5}</p>
          <p><strong>Speed:</strong> {hoveredEvent.speed} km/s</p>
          <p><strong>Type:</strong> {hoveredEvent.type}</p>
        </div>
      )}

      {/* 🟢 3D Sun Scene (useThree fix inside Canvas) */}
      <SceneWrapper onHover={handleHover} isHovered={isHovered} />
    </div>
  );
};

export default SolarScene;
