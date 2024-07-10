import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fixing default icon issue with React Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const geojsonFeature = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.1, 51.505],
            [-0.1, 51.51],
            [-0.06, 51.51],
            [-0.06, 51.505],
            [-0.1, 51.505],
          ],
        ],
      },
    },
  ],
};

const MapComponent = () => {
  // State to toggle GeoJSON layer visibility
  const [showGeoJSON, setShowGeoJSON] = useState(true);
  // State to store markers created by the user
  const [markers, setMarkers] = useState([]);

  // Function called when a new layer is created by the user
  const handleCreated = (e) => {
    const type = e.layerType; 
    const layer = e.layer; 

    if (type === 'marker') {
      // Add the marker's position to the markers state array
      setMarkers([...markers, layer.getLatLng()]);
    }
  };

  // Function called when a layer is deleted by the user
  const handleDeleted = (e) => {
    const layers = e.layers; 

    layers.eachLayer((layer) => {
      // Filter out the deleted marker from the markers state array
      setMarkers(markers.filter(marker => marker.lat !== layer.getLatLng().lat && marker.lng !== layer.getLatLng().lng));
    });
  };

  return (
    <div>
      {/* MapContainer component from React Leaflet */}
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '80vh', width: '100%' }}>
        {/* Base TileLayer using OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Example Marker with Popup */}
        <Marker position={[51.505, -0.09]}>
          <Popup>
            You clicked the marker!
          </Popup>
        </Marker>
        {/* Conditional rendering of GeoJSON layer based on showGeoJSON state */}
        {showGeoJSON && (
          <GeoJSON data={geojsonFeature} style={{ color: 'red', opacity: 0.5 }} />
        )}
        {/* FeatureGroup for editing controls and user-created markers */}
        <FeatureGroup>
          {/* EditControl for drawing and editing features */}
          <EditControl
            position="topright"
            onCreated={handleCreated} 
            onDeleted={handleDeleted} 
            draw={{
              rectangle: true,
              circle: true,
              circlemarker: true,
              polyline: true,
              polygon: true,
            }}
          />
          {/* Mapping over markers state array to render user-created markers */}
          {markers.map((position, idx) => (
            <Marker key={`marker-${idx}`} position={position}>
              <Popup>
                Marker at {position.toString()}
              </Popup>
            </Marker>
          ))}
        </FeatureGroup>
      </MapContainer>
      {/* Button to toggle GeoJSON layer visibility */}
      <button onClick={() => setShowGeoJSON(!showGeoJSON)}>
        Toggle GeoJSON Layer
      </button>
    </div>
  );
};

export default MapComponent;
