import React, { useState, useEffect } from "react";
import { popularCities } from "../assets/constants";

const HotelSearch = ({ handleChange, location, place, setPlace }) => {
    const currentCountry = location.country
    const [showSuggestions, setShowSuggestions] = useState(false)

    const toggleSearchSuggestions = () => {
        setShowSuggestions((prev) => !prev)
    }

    const handleClickOutside = (e) => {
        if (showSuggestions && e.target.closest(".search-suggestions") === null) setShowSuggestions(false)
    };
        
    useEffect(() => {
        if (showSuggestions) document.addEventListener("mousedown", handleClickOutside);
    
        else document.removeEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSuggestions]);

    return (<>
        <div className="hotel-search">
            <i id="input-icon" className="ri-home-4-line"></i><input type="text" value={place} onClick={toggleSearchSuggestions} className="search-input" placeholder="Where you want to go?" onChange={handleChange} />
            <div className={showSuggestions ? "search-suggestions show" : "search-suggestions"}>
                <div className="search-suggestions-header">
                    <p className="search-suggestions-disc">Popular cities in relation to your location:</p>
                </div>
                {!currentCountry ? "" : popularCities[currentCountry].map(city => {
                    return <a key={city} className="suggestions-item" onClick={() => {setPlace(city); setShowSuggestions(false)}}><i className="ri-map-pin-2-line"></i> {city}</a>
                })}
            </div>
            <button className="checkin-checkout"><i className="ri-calendar-2-line"></i> Check In - Check Out</button>
            <button className="people-count"><i className="ri-group-fill"></i> 1 adult · 0 child · 1 room</button>
            <button className="search">Search</button>
        </div>
    </>)
}

export default HotelSearch;