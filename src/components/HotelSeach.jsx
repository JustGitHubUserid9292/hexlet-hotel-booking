import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { formatDate } from "../assets/constants";
import { popularCities } from "../assets/constants";

const HotelSearch = ({ handleChange, location, place, setPlace, checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults, childrens, setChilderns, rooms, setRooms }) => {
    const currentCountry = location.country
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [showBookingDetails, setShowBookingDetails] = useState(false)

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

    const toggleBookingDetails = () => {
        setShowBookingDetails((prev) => !prev)
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

    const handlePlusAdults = () => {
        return adults < 9 && setAdults((prev) => prev + 1)
    }

    const handleMinusAdults = () => {
        return adults > 1 && setAdults((prev) => prev - 1)
    }

    const handlePlusChildrens = () => {
        return childrens < 9 && setChilderns((prev) => prev + 1)
    }

    const handleMinusChildrens = () => {
        return childrens > 0 && setChilderns((prev) => prev - 1)
    }

    const handlePlusRooms = () => {
        return rooms < 9 && setRooms((prev) => prev + 1)
    }

    const handleMinusRooms = () => {
        return rooms > 1 && setRooms((prev) => prev - 1)
    }

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
            <button className="booking-details-btn" onClick={toggleBookingDetails}><i className="ri-group-fill"></i> {adults} adult · {childrens} child · {rooms} room</button>
            <div className={showBookingDetails ? "booking-details show" : "booking-details"}>
                Adults: <div className="booking-details-item"><button className="plus" onClick={handlePlusAdults}><i className="ri-add-line"></i></button><input type="number" className="adults" value={adults} readOnly></input><button className="minus" onClick={handleMinusAdults}><i className="ri-subtract-line"></i></button></div>
                Childrens: <div className="booking-details-item"><button className="plus" onClick={handlePlusChildrens}><i className="ri-add-line"></i></button><input type="number" className="childrens" value={childrens} readOnly></input><button className="minus" onClick={handleMinusChildrens}><i className="ri-subtract-line"></i></button></div>
                Rooms: <div className="booking-details-item"><button className="plus" onClick={handlePlusRooms}><i className="ri-add-line"></i></button><input type="number" className="rooms" value={rooms} readOnly></input><button className="minus" onClick={handleMinusRooms}><i className="ri-subtract-line"></i></button></div>
                <button className="ready" onClick={toggleBookingDetails}>Ready</button>
            </div>
            <button className="search">Search</button>
        </div>
    </>)
}

export default HotelSearch;