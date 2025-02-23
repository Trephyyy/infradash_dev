"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

const GradientMaterial = () => {
  return (
    <shaderMaterial
      attach="material"
      uniforms={{
        color1: { value: new THREE.Color("#ffcc00") },
        color2: { value: new THREE.Color("#ff4500") },
      }}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        varying vec2 vUv;
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `}
    />
  );
};

const Sun = ({ onHover, isHovered, setIsHovered, solarEvents }) => {
  const sunRef = useRef();
  useFrame(() => {
    if (sunRef.current && !isHovered) {
      sunRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh
      ref={sunRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <sphereGeometry args={[3, 128, 128]} />
      <GradientMaterial />
      <SolarEventMarkers data={solarEvents} onHover={onHover} />
    </mesh>
  );
};

const SolarEventMarkers = ({ data = [], onHover }) => {
  const [hovered, setHovered] = useState(null);
  const lastHoveredRef = useRef(null);
  const hoverTimeout = useRef(null);
  const markerSize = data.length > 30 ? 0.05 : 0.1;

  // Memoize the glow texture to avoid recreating it on every render
  const glowTexture = useMemo(() => getGlowTexture(), []);

  const positions = useMemo(() => {
    return data
      .map((event) => {
        if (!event.latitude || !event.longitude) return null;
        const latRad = (event.latitude * Math.PI) / 180;
        const lonRad = (event.longitude * Math.PI) / 180;
        const radius = 3.05;
        return {
          position: new THREE.Vector3(
            radius * Math.cos(latRad) * Math.cos(lonRad),
            radius * Math.sin(latRad),
            radius * Math.cos(latRad) * Math.sin(lonRad)
          ),
          data: event,
        };
      })
      .filter(Boolean);
  }, [data]);

  return (
    <group>
      {positions.map((event, index) => (
        <group key={index}>
          <mesh
            position={event.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              if (lastHoveredRef.current !== event) {
                lastHoveredRef.current = event;
                clearTimeout(hoverTimeout.current);
                hoverTimeout.current = setTimeout(() => {
                  setHovered(event);
                  onHover(
                    {
                      time: `Time: ${event.data.time21_5}`,
                      details: `Type: ${event.data.type} - Speed: ${event.data.speed} km/s`,
                      note: event.data.note,
                    },
                    e.clientX,
                    e.clientY
                  );
                }, 50);
              }
            }}
            onPointerOut={() => {
              if (lastHoveredRef.current !== null) {
                lastHoveredRef.current = null;
                clearTimeout(hoverTimeout.current);
                setHovered(null);
                onHover(null, 0, 0);
              }
            }}
          >
            <sphereGeometry args={[markerSize, 16, 16]} />
            <meshStandardMaterial
              color={hovered === event ? "yellow" : "#ADB4BF"}
              emissive={hovered === event ? "yellow" : "#ADB4BF"}
              emissiveIntensity={2}
            />
          </mesh>
          <sprite position={event.position} scale={[0.2, 0.2, 0.2]}>
            <spriteMaterial attach="material" map={glowTexture} />
          </sprite>
        </group>
      ))}
    </group>
  );
};

const getGlowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
  gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

const SceneWrapper = ({ onHover, isHovered, setIsHovered, solarEvents }) => {
  return (
    <Canvas
      style={{ width: "100%", height: "500px", background: "black" }}
      camera={{ position: [0, 0, 10] }}
    >
      <Stars radius={300} depth={50} count={5000} factor={4} />
      <Sun onHover={onHover} isHovered={isHovered} setIsHovered={setIsHovered} solarEvents={solarEvents} />
      <pointLight position={[10, 10, 10]} intensity={3} color={"#ff9900"} />
      <ambientLight intensity={1.8} />
      <OrbitControls minDistance={5} maxDistance={20} />
    </Canvas>
  );
};

const SolarScene = () => {
  const [solarEvents, setSolarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (data, x, y) => {
    if (data) {
      setTooltip({ data, x, y });
    } else {
      setTooltip(null);
    }
  };

  useEffect(() => {
    const fetchSolarEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.infradash.space/api/donki/search?startDate=2025-01-01&endDate=2025-01-31&eventType=Analisys`
        );
        const data = await res.json();
        setSolarEvents(data.filter((event) => event.latitude && event.longitude));
      } catch (error) {
        console.error("Error fetching solar events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSolarEvents();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {loading && <p>Loading events...</p>}
      <SceneWrapper
        solarEvents={solarEvents}
        onHover={handleHover}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
      />
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            pointerEvents: "none",
            transform: "translate(-5px, 0)", // Move directly under the cursor
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "200px",
          }}
        >
          <p>{tooltip.data.time}</p>
          <p>{tooltip.data.details}</p>
          {tooltip.data.note && <p>{tooltip.data.note}</p>}
        </div>
      )}
    </div>
  );
};

export default SolarScene;
