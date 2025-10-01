"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Dynamic components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

// Custom component using useMap
function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.flyTo(position, 13); // zoom to location
    }
  }, [map, position]);

  return null;
}

export default function Minimap() {
  const position: [number, number] = [-9.6498, -35.7089]; // Example: Maceió, BR

  return (
    <div className="w-full h-full ">
      <MapContainer
        center={position}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full rounded-md"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains={["a", "b", "c", "d"]}
        />

        <Marker position={position}>
          <Popup>Você está aqui 🚀</Popup>
        </Marker>

        <Circle center={position} radius={2000} />

        {/* useMap example */}
        <FlyToLocation position={position} />
      </MapContainer>
    </div>
  );
}
