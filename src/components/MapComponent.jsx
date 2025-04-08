import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import getCityInfo from '../requests/getCityInfo';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

const normalize = (text) => {
    return text.split(' ').map(elm => elm[0] + elm.slice(1, elm.length).toLowerCase()).join(' ')
}

const MapComponent = ({ hotelsList, request, activeHotelId }) => { 
    const [center, setCenter] = useState("")

    useEffect(() => {
        const fetchCityCoords = async () => {
            const data = await getCityInfo(request)
            const { latitude, longitude } = data[0].geoCode
            setCenter([latitude, longitude])
        }
        fetchCityCoords()
    }, [request])

    const createIcon = (isActive) =>
        new L.divIcon({
            className: 'remix-icon',
            iconSize: [40, 40],
            iconAnchor: [15, 30],
            popupAnchor: [0, -25],
            html: `<i class="ri-map-pin-line" style="font-size: 30px; color: ${isActive ? 'red' : '#007BFF'};"></i>`,
    });

    return (<>
    {center && <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "90%", width: "95%", borderRadius: "12px" }}
        attributionControl={false}
      >
        <TileLayer
           url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
  
        {hotelsList.map(({ name, hotelId, geoCode }, index) => (
          <Marker key={index} position={[geoCode.latitude, geoCode.longitude]} icon={createIcon(activeHotelId === hotelId)} eventHandlers={{
            click: () => {
              const el = document.getElementById(`hotel-${hotelId}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('active');
              setTimeout(() => el.classList.remove('active'), 1500);
            }
          }}>
            <Popup>{normalize(name)}</Popup>
          </Marker>
        ))}
      </MapContainer>}
    </>
  );
};

export default MapComponent;
