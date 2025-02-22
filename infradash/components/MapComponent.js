"use client"; // Required for Next.js App Router

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ data }) => {
  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data.map((item, index) => (
        <Marker key={index} position={[item.latitude, item.longitude]}>
          <Popup>
            <b>Time:</b> {item.time21_5} <br />
            <b>Speed:</b> {item.speed} km/s <br />
            <b>Half Angle:</b> {item.halfAngle}° <br />
            <b>Type:</b> {item.type} <br />
            <a href={item.link} target="_blank" rel="noopener noreferrer">View More</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
