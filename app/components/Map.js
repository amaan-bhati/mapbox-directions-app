'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const Map = ({ startCoordinates, endCoordinates }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: startCoordinates || [-74.5, 40], // Default center
      zoom: 9,
    });

    if (startCoordinates && endCoordinates) {
      new mapboxgl.Marker().setLngLat(startCoordinates).addTo(map.current);
      new mapboxgl.Marker().setLngLat(endCoordinates).addTo(map.current);
    }
  }, [startCoordinates, endCoordinates]);

  return <div ref={mapContainer} className="h-96 w-full" />;
};

export default Map;
