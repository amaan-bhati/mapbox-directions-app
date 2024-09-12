"use client"; // Add this line to make the component a Client Component

import { useState } from "react";
import Map from "./components/Map";

export default function Home() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);

  const getCoordinates = async (location) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
    );
    const data = await res.json();

    if (!data.features || data.features.length === 0) {
      throw new Error(
        `No results found for "${location}". Please try a different location.`
      );
    }

    return data.features[0].center; // Returns the [longitude, latitude]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const start = await getCoordinates(startLocation);
      const end = await getCoordinates(endLocation);

      console.log("Start coordinates:", start);
      console.log("End coordinates:", end);

      const matrixRes = await fetch(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${start.join(
          ","
        )};${end.join(",")}?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_API_KEY
        }`
      );
      const matrixData = await matrixRes.json();

      console.log("Matrix API response:", matrixData);

      if (
        !matrixData.distances ||
        matrixData.distances.length === 0 ||
        !matrixData.distances[0]
      ) {
        throw new Error(
          "No distance data found. Please try again with valid locations."
        );
      }

      const distance = matrixData.distances[0][1];
      alert(`Distance: ${(distance / 1000).toFixed(2)} km`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#202754] via-[#131931] to-[#0d121d] p-6">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#fa5560] via-[#b14bf4] to-[#4d91ff]">
        Mapbox Directions
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 mb-8"
      >
        <input
          type="text"
          placeholder="Start Location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          className="bg-gradient-to-r from-[#16171b] via-[#323335] to-[#101114] border border-gray-400 p-3 rounded-lg w-72 text-white-700 
             border-1 border-pink shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] 
             hover:shadow-[0_0_15px_4px_rgba(255,255,255,0.9)]"
        />

        <input
          type="text"
          placeholder="End Location"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          className="bg-gradient-to-r from-[#16171b] via-[#323335] to-[#101114] border border-gray-400 p-3 rounded-lg w-72 text-white-700 
             border-1 border-pink shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] 
             hover:shadow-[0_0_15px_4px_rgba(255,255,255,0.9)]"
        />

        <button
          type="submit"
          className=" font-bold bg-gradient-to-r from-[#fa5560] via-[#b14bf4] to-[#4d91ff] text-white px-6 py-3 rounded-lg hover:from-[#4d91ff]hover:via-orange-400 hover:to-orange-500 transition"
        >
          Get Directions
        </button>
      </form>
      {startCoordinates && endCoordinates && (
        <div className="w-full max-w-4xl h-96">
          <Map
            startCoordinates={startCoordinates}
            endCoordinates={endCoordinates}
          />
        </div>
      )}
    </div>
  );
}
