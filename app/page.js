'use client'; // Add this line to make the component a Client Component

import { useState } from 'react';
import Map from './components/Map';

export default function Home() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);

  const getCoordinates = async (location) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
    );
    const data = await res.json();
  
    if (!data.features || data.features.length === 0) {
      throw new Error(`No results found for "${location}". Please try a different location.`);
    }
    
    return data.features[0].center; // Returns the [longitude, latitude]
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const start = await getCoordinates(startLocation);
      const end = await getCoordinates(endLocation);
  
      console.log('Start coordinates:', start);
      console.log('End coordinates:', end);
  
      const matrixRes = await fetch(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${start.join(',')};${end.join(',')}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
      );
      const matrixData = await matrixRes.json();
  
      console.log('Matrix API response:', matrixData);
  
      if (!matrixData.distances || matrixData.distances.length === 0 || !matrixData.distances[0]) {
        throw new Error('No distance data found. Please try again with valid locations.');
      }
  
      const distance = matrixData.distances[0][1];
      alert(`Distance: ${(distance / 1000).toFixed(2)} km`);
  
    } catch (error) {
      alert(error.message);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl text-gray-900 font-bold mb-8">Mapbox Directions</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 mb-8">
        <input
          type="text"
          placeholder="Start Location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-72 text-gray-700"
        />
        <input
          type="text"
          placeholder="End Location"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-72 text-gray-700"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition">
          Get Directions
        </button>
      </form>
      {startCoordinates && endCoordinates && (
        <div className="w-full max-w-4xl h-96">
          <Map startCoordinates={startCoordinates} endCoordinates={endCoordinates} />
        </div>
      )}
    </div>
  );
}
