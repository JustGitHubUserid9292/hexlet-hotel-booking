import React, { useEffect, useState } from "react";
import { popularCities, firstPriceIds, currenciesSymbols } from "../assets/constants";
import getCityInfo from "../requests/getCityInfo";
import getHotels from "../requests/getHotels";
import getHotelInfo from "../requests/getHotelInfo";
import convertCurrency from "../requests/convertCurrency";

const getImage = (imageName) => {
    return new URL(`../assets/${imageName}.jpg`, import.meta.url).href;
};

const getLogo = (logoName) => {
    return new URL(`../assets/${logoName}.png`, import.meta.url).href;
}

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
    const [isNext, setNext] = useState(false)
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

    const handleOpenUrl = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (<>
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
        <h1 className="discount-title">Discounts for new users</h1>
        <div className="new-user-discount">
            <img className="discount-logo" src={getLogo("discount")} alt="discount-logo" />
            <p className="new-user-discount-disc">Sign in to your account and save money<span>Save from 10% on your first hotel booking.</span></p>
            <div className="new-user-discount-btns"><button className="new-user-discount-sign-in">Sign in</button><button className="new-user-discount-register">Register</button></div>
        </div>
        <h1 className="travel-blog-title">A travel blog for inspiration on your next trip</h1>
        <div className="travel-blog">
            <h1 className="travel-container-title">Popular Articles</h1>
            <div className="travel-container">
                <button className="prevArticle" onClick={() => setNext(false)} disabled={!isNext}><i className="ri-arrow-drop-left-line"></i></button>
                <div className={!isNext ? "travel-item show" : "travel-item"} onClick={() => handleOpenUrl("https://www.thetimes.com/travel/destinations/europe-travel/25-best-secret-beaches-in-europe-wm0l3gr7b")}>
                    <img className="travel-image" src={getImage("secret-europe")} alt="travel-image"/>
                    <span className="travel-title">25 best secret beaches in Europe</span>
                    <p className="travel-disc">Europe's secret beaches are picturesque bays that you can't get to without knowing the local trails.</p>
                    <span className="travel-source">thetimes.com</span>
                </div>
                <div className={!isNext ? "travel-item show" : "travel-item"} onClick={() => handleOpenUrl("https://tripsider.com/blog/around-russia/wild-russia-a-trip-to-the-most-incredible-remote-places")}>
                    <img className="travel-image" src={getImage("wild-russia")} alt="travel-image"/>
                    <span className="travel-title">Wild Russia: traveling to the most incredible remote places</span>
                    <p className="travel-disc">The most secluded places in Russia - corners of the country where you can enjoy the wilderness.</p>
                    <span className="travel-source">tripsider.com</span>
                </div>
                <div className={isNext ? "travel-item show" : "travel-item"} onClick={() => handleOpenUrl("https://flextates.com/travel-blog/hidden-gems-unexplored-destinations-of-asia-that-will-take-your-breath-away/")}>
                    <img className="travel-image" src={getImage("asia-gems")} alt="travel-image"/>
                    <span className="travel-title">Hidden Gems: Unexplored destinations of Asia that will take your breath away</span>
                    <p className="travel-disc">Asia's unusual cities are hidden gems for adventurers.</p>
                    <span className="travel-source">flextates.com</span>
                </div>
                <div className={isNext ? "travel-item show" : "travel-item"} onClick={() => handleOpenUrl("https://www.dezeen.com/2022/08/01/futuristic-cities-planned-architecture-masterplanning-urban-design/")}>
                    <img className="travel-image" src={getImage("unique-architecture")} alt="travel-image"/>
                    <span className="travel-title">Ten futuristic cities set to be built around the world</span>
                    <p className="travel-disc">Cities with unique architecture - unusual buildings and futuristic landscapes.</p>
                    <span className="travel-source">dezeen.com</span>
                </div>
                <button className="nextArticle" onClick={() => setNext(true)} disabled={isNext}><i className="ri-arrow-drop-right-line"></i></button>
            </div>
        </div>
        <div className="site-disc">
            <div className="site-disc-item">
                <img className="site-disc-item-image" src={getLogo('hotel-bed')} alt="hotel"/>
                <h1>A wide range of hotels</h1>
                <p>We have over 500,000 accommodation options worldwide, from budget hostels to luxury resorts. Whatever your preferences and budget, it's easy to find the perfect hotel. Our easy-to-use search allows you to choose accommodation based on location, travel dates and number of guests.</p>
            </div>
            <div className="site-disc-item">
                <img className="site-disc-item-image" src={getLogo('wallet')} alt="wallet"/>
                <h1>Best Deals & Offers</h1>
                <p>Thanks to our partnerships with major hotel chains and local hotels, we offer competitive rates and exclusive discounts. Book your accommodation at the best price, take advantage of loyalty programs and promotions to save on your next trip. We are constantly updating offers so you can choose the best.</p>
            </div>
            <div className="site-disc-item">
                <img className="site-disc-item-image" src={getLogo('24-hours')} alt="hotel"/>
                <h1>24/7 support</h1>
                <p>Our support team is available 24 hours a day to help you with reservations, changing dates or resolving any issues during your trip. If you have difficulties with check-in or need additional services, our specialists will contact the hotel and find a solution promptly.You can always count on us!</p>
            </div>
        </div>
      </>);
}
  
export default HomePageItems;
