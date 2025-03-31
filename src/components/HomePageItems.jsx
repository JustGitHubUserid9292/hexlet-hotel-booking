import React, { useEffect, useState } from "react";
import { popularCities, firstPriceIds, currenciesSymbols } from "../assets/constants";
import getCityInfo from "../requests/getCityInfo";
import getHotels from "../requests/getHotels";
import getHotelInfo from "../requests/getHotelInfo";
import convertCurrency from "../requests/convertCurrency";

const getImage = (logoName) => {
    return new URL(`../assets/${logoName}.jpg`, import.meta.url).href;
};

const cityCode = async (cityName) => {
    const data = await getCityInfo(cityName);
    return data[0].iataCode;
};

const hotelsCount = async (cityName) => {
    const code = await cityCode(cityName);
    const data = await getHotels(code);
    return data.length;
};

const getFirstPrice = async (cityName) => {
    const data = await getHotelInfo(firstPriceIds[cityName]);
    return {
        total: data[0].offers[0].price.total,
        currency: data[0].offers[0].price.currency  
    };
};

const formattedNumber = (num) => {
    return Number(num).toLocaleString("en-US", {
        maximumFractionDigits: 0
    });
};

const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const HomePageItems = ({ currency, setPlace }) => {
    const [startIndex, setStartIndex] = useState(0);
    const [hotelsInfo, setHotelsInfo] = useState(loadFromLocalStorage("hotelsInfo") || {});
    const [isLoading, setLoading] = useState(false)
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchHotelsData = async () => {
            let updatedHotelsInfo = loadFromLocalStorage("hotelsInfo") || {};

            for (const city of popularCities) {
                if (!updatedHotelsInfo[city]) { 
                    const count = await hotelsCount(city);
                    const firstPrice = await getFirstPrice(city);

                    updatedHotelsInfo[city] = { 
                        count, 
                        basePrice: Number(firstPrice.total), 
                        baseCurrency: firstPrice.currency
                    };
                }
            }

            setHotelsInfo(updatedHotelsInfo);
            saveToLocalStorage("hotelsInfo", updatedHotelsInfo);
        };

        fetchHotelsData();
    }, []); 


    useEffect(() => {
        const convertPrices = async () => {
            setLoading(true)
            let updatedHotelsInfo = { ...hotelsInfo };

            for (const city of Object.keys(updatedHotelsInfo)) {
                const { basePrice, baseCurrency } = updatedHotelsInfo[city];
                const convertedPrice = await convertCurrency(basePrice, baseCurrency, currency);
                
                updatedHotelsInfo[city] = { 
                    ...updatedHotelsInfo[city], 
                    convertedPrice, 
                    currency 
                };
            }

            setHotelsInfo(updatedHotelsInfo);
            setLoading(false)
        };

        if (Object.keys(hotelsInfo).length > 0) {
            convertPrices();
        }
    }, [currency]);

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
                      <img className="popular-city-image" src={getImage(city)} alt={city} />
                      <div className="popular-city-disc">
                          <p className="popular-city-title">{city}</p>
                          {!isLoading && hotelsInfo[city] ? <div className="popular-city-hotels-info"><p className="popular-city-hotels-count">{!hotelsInfo[city].count ? "N/A" : hotelsInfo[city].count} <span>Hotels</span></p><p className="popular-city-hotels-price">{!currenciesSymbols[hotelsInfo[city].currency] ? "" : currenciesSymbols[hotelsInfo[city].currency]}{hotelsInfo[city]?.convertedPrice !== undefined  ? formattedNumber(hotelsInfo[city].convertedPrice)  : "N/A"} <span>Initial price</span></p></div>: <div className="spinner"><i className="ri-loader-4-line spinner-icon"></i></div>}
                      </div>
                  </div>
              ))}
              <button className="nextCity" onClick={handleNext} disabled={startIndex + itemsPerPage >= popularCities.length}><i className="ri-arrow-drop-right-line"></i></button>
          </div>
        </div>
      );
  }
  
  export default HomePageItems;
