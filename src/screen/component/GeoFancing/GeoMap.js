// import React from "react";
// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   useJsApiLoader
// } from "@react-google-maps/api";

// const containerStyle = {
//   width: "100%",
//   height: "400px"
// };

// const mapOptions = {
//   disableDefaultUI: true,
// };

// const GeoDistanceMap = ({ startLat, startLng, endLat, endLng }) => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // 🔴 Replace with your real key
//   });

//   const start = { lat: parseFloat(startLat), lng: parseFloat(startLng) };
//   const end = { lat: parseFloat(endLat), lng: parseFloat(endLng) };

//   const path = [start, end];

//   const calculateDistance = () => {
//     const R = 6371e3; // meters
//     const φ1 = (start.lat * Math.PI) / 180;
//     const φ2 = (end.lat * Math.PI) / 180;
//     const Δφ = ((end.lat - start.lat) * Math.PI) / 180;
//     const Δλ = ((end.lng - start.lng) * Math.PI) / 180;

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) *
//       Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     const distance = R * c; // in meters
//     return (distance / 1000).toFixed(2); // in km
//   };

//   const center = {
//     lat: (start.lat + end.lat) / 2,
//     lng: (start.lng + end.lng) / 2
//   };

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={12}
//         options={mapOptions}
//       >
//         <Marker position={start} label="Start" />
//         <Marker position={end} label="End" />
//         <Polyline
//           path={path}
//           options={{
//             strokeColor: "#FF0000",
//             strokeOpacity: 1.0,
//             strokeWeight: 2
//           }}
//         />
//       </GoogleMap>
//       <div className="mt-2 text-center fw-bold">
//         Distance: {calculateDistance()} km
//       </div>
//     </>
//   );
// };

// export default GeoDistanceMap;

import React from "react";

const StaticMap = ({ latitude, longitude }) => {
  if (!latitude || !longitude) return <p>Invalid coordinates</p>;

  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=600x400&markers=${latitude},${longitude},red`;

  return (
    <img
      src={mapUrl}
      alt="OpenStreetMap Static"
      style={{ width: '100%', height: '400px', objectFit: 'cover' }}
    />
  );
};

export default StaticMap;
