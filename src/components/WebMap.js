import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onMapPress }) {
  useMapEvents({
    click: (e) => {
      if (onMapPress) {
        onMapPress({
          nativeEvent: {
            coordinate: {
              latitude: e.latlng.lat,
              longitude: e.latlng.lng
            }
          }
        });
      }
    }
  });
  return null;
}

const WebMap = ({ 
  style, 
  region, 
  onPress, 
  showsUserLocation, 
  children 
}) => {
  const [center, setCenter] = useState([
    region?.latitude || 30.0444, 
    region?.longitude || 31.2357
  ]);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (region) {
      setCenter([region.latitude, region.longitude]);
      // Calculate zoom based on delta (approximate)
      const zoomLevel = Math.round(Math.log2(360 / (region.latitudeDelta || 0.5)));
      setZoom(Math.max(1, Math.min(18, zoomLevel)));
    }
  }, [region]);

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        key={`${center[0]}-${center[1]}-${zoom}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onMapPress={onPress} />
        {children}
      </MapContainer>
    </div>
  );
};

// Web-compatible Marker component
const WebMarker = ({ coordinate, title, description }) => {
  if (!coordinate) return null;
  
  return (
    <Marker position={[coordinate.latitude, coordinate.longitude]}>
    </Marker>
  );
};

export { WebMap as MapView, WebMarker as Marker };
