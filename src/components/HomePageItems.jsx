import React, { useEffect, useState } from "react";
import { popularCities } from "../assets/constants";
import getCityInfo from "../requests/getCityInfo";
import getHotels from "../requests/getHotels"


const getLogo = (logoName) => {
    return new URL(`../assets/${logoName}.jpg`, import.meta.url).href;
};

const cityCode = async (cityName) => {
    const data = await getCityInfo(cityName)
    return data[0].iataCode
}

const hotelsCount = async (cityName) => {
    const code = await cityCode(cityName)
    const data = await getHotels(code)
    return data.length
}

const HomePageItems = ({ setPlace }) => {
    const [startIndex, setStartIndex] = useState(0);
    const [hotelsInfo, setHotelsInfo] = useState({})
    const itemsPerPage = 4;

    useEffect(() => {
        popularCities.forEach(async (city) => {
            const count = await hotelsCount(city);
            setHotelsInfo((prev) => ({ ...prev, [city]: count }));
        });
    }, []); 

    const handleNext = () => {
        if (startIndex + itemsPerPage < popularCities.length) {
            setStartIndex(startIndex + 2);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 2);
        }
    };

    return (
      <div className="popular-searches">
        <h1 className="popular-title">Popular Searches</h1>
        <div className="popular-searches-container">
            <button className="prevCity" onClick={handlePrev} disabled={startIndex === 0}><i className="ri-arrow-drop-left-line"></i></button>
            {popularCities.slice(startIndex, startIndex + itemsPerPage).map(city => (
                <div key={city} className="popular-searches-item" onClick={() => setPlace(city)}>
                    <img className="popular-city-image" src={getLogo(city)} alt={city} />
                    <div className="popular-city-disc">
                        <p className="popular-city-title">{city}</p>
                        {hotelsInfo[city] ? <p className="popular-city-hotels-count">{hotelsInfo[city]} <span>Hotels</span></p> : <div className="spinner"><i className="ri-loader-4-line spinner-icon"></i></div>}
                    </div>
                </div>
            ))}
            <button className="nextCity" onClick={handleNext} disabled={startIndex + itemsPerPage >= popularCities.length}><i className="ri-arrow-drop-right-line"></i></button>
        </div>
      </div>
    );
}

export default HomePageItems;
