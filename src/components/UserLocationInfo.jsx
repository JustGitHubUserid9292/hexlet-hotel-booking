import React, { useState, useEffect } from "react";
import axios from "axios";

const UserLocationInfo = ({ location, setLocation }) => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            );

            const { address } = response.data;
            setLocation({
              city: address.city || address.town || address.village || "Unknown city",
              country: address.country || "Unknown country",
            });
          } catch (err) {
            setError("Couldn't retrieve location info");
          } finally {
            setLoading(false)
          }
        },
      );
    } else {
      setError("Allow user location");
    }
  }, []);

  return (
    <div className="user-location">
      {isLoading ? <div className="spinner"><i className="ri-loader-4-line spinner-icon"></i></div> : <h1><i className="ri-map-pin-2-line"></i> {error ? error : `${location.city}, ${location.country}`}</h1>}
    </div>
  );
};

export default UserLocationInfo;
