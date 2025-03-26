import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { formatDate } from "../assets/constants";
import { popularCities } from "../assets/constants";

const HotelSearch = ({ handleChange, location, place, setPlace }) => {
    const currentCountry = location.country
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [checkIn, setCheckIn] = useState(null)
    const [checkOut, setCheckOut] = useState(null)

    const handleClickOutside = (e) => {
        if (showSuggestions && e.target.closest(".search-suggestions") === null) setShowSuggestions(false)
        if (showCalendar && e.target.closest(".calendar-popup") === null) setShowCalendar(false)
    };
        
    useEffect(() => {
        if (showSuggestions) document.addEventListener("mousedown", handleClickOutside);
    
        else document.removeEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSuggestions]);

    useEffect(() => {
        if (showCalendar) document.addEventListener("mousedown", handleClickOutside);
    
        else document.removeEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showCalendar]);


    const toggleSearchSuggestions = () => {
        setShowSuggestions((prev) => !prev)
    }

    const toggleCalendar = () => {
        setShowCalendar((prev) => !prev)
    }

    const selectDates = (date) => {
        if (!checkIn || (checkIn && checkOut)) {
          setCheckIn(date);
          setCheckOut(null);
        }
        else if (checkIn === date) {
          setCheckIn(null);
          setCheckOut(null);
        } 
        else if (new Date(date) > new Date(checkIn)) {
          setCheckOut(date);
          setShowCalendar(false);
        }
        else {
          setCheckIn(date);
          setCheckOut(null);
        }
    };

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
            <button className={showCalendar ? "checkin-checkout focus" : "checkin-checkout"} onClick={toggleCalendar}><i className="ri-calendar-2-line"></i> {!checkIn ? "Check In" : formatDate(checkIn)} - {!checkOut ? "Check Out" : formatDate(checkOut)}</button>
            <div className={showCalendar ? "calendar-popup show" : "calendar-popup"}>
                <Calendar checkIn={checkIn} checkOut={checkOut} selectDates={selectDates}/>
            </div>
            <button className="people-count"><i className="ri-group-fill"></i> 1 adult · 0 child · 1 room</button>
            <button className="search">Search</button>
        </div>
    </>)
}

export default HotelSearch;