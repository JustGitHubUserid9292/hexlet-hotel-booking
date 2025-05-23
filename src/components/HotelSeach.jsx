import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { formatDate } from "../assets/constants";
import { popularCitiesRelLocation } from "../assets/constants";
import getCityInfo from "../requests/getCityInfo";
import { useNavigate } from 'react-router-dom'

const HotelSearch = ({ handleChange, location, place, setPlace, checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults, children, setChildren, rooms, setRooms, setSearch }) => {
    const currentCountry = location.country
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [showBookingDetails, setShowBookingDetails] = useState(false)
    const [searchSuggestions, setSearchSuggestions] = useState([])

    const navigate = useNavigate()

    const handleClickOutside = (e) => {
        if (showSuggestions && e.target.closest(".search-suggestions") === null) setShowSuggestions(false)
        if (showCalendar && e.target.closest(".calendar-popup") === null) setShowCalendar(false)
        if (showBookingDetails && e.target.closest(".booking-details") === null) setShowBookingDetails(false)
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

    useEffect(() => {
        if (showBookingDetails) document.addEventListener("mousedown", handleClickOutside);
    
        else document.removeEventListener("mousedown", handleClickOutside);
    
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showBookingDetails]);

    useEffect(() => {
        const fetchCityInfo = async () => {
            if (!place) return;
    
            try {
                const data = await getCityInfo(place);
                return data && setSearchSuggestions(data.filter(elm => elm.iataCode).slice(0, 5));
            } catch (error) {
                console.error("Error fetching city info:", error);
                setSearchSuggestions([]); 
            }
        };
    
        setSearchSuggestions([]);
        fetchCityInfo();
    }, [place]);

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

    const handlePlusChildren = () => {
        return children < 9 && setChildren((prev) => prev + 1)
    }

    const handleMinusChildren = () => {
        return children > 0 && setChildren((prev) => prev - 1)
    }

    const handlePlusRooms = () => {
        return rooms < 9 && setRooms((prev) => prev + 1)
    }

    const handleMinusRooms = () => {
        return rooms > 1 && setRooms((prev) => prev - 1)
    }

    const handleSearch = (place) => {
        if (place) {
            setSearch(true)
            return checkIn && checkOut ? navigate(`/hotels-list?place=${place}&adults=${adults}&roomQuantity=${rooms}&checkInDate=${checkIn}&checkOutDate=${checkOut}`) : navigate(`/hotels-list?place=${place}&adults=${adults}&roomQuantity=${rooms}`)
        }
        return; 
    }

    return (<>
        <div className="hotel-search">
            <i id="input-icon" className="ri-search-line"></i><input type="text" value={place} onClick={toggleSearchSuggestions} className="search-input" placeholder="Where you want to go?" onChange={handleChange} />
            <div className={showSuggestions ? "search-suggestions show" : "search-suggestions"}>
                <div className="search-suggestions-header">
                    <p className="search-suggestions-disc">{place ? `Results found for your query:` : "Popular cities in relation to your location:"}</p>
                </div>
                {place ? searchSuggestions.map(({ name, address }, index) => {
                    return <a key={index} className="suggestions-item" onClick={() => {setPlace(name); setShowSuggestions(false)}}><i className="ri-map-pin-2-line"></i> {name}, {address.countryCode}</a>
                }) : !currentCountry ? "" : popularCitiesRelLocation[currentCountry].map(city => {
                    return <a key={city} className="suggestions-item" onClick={() => {setPlace(city); setShowSuggestions(false)}}><i className="ri-map-pin-2-line"></i> {city}, {currentCountry.slice(0, 2).toUpperCase()}</a>
                })}
            </div>
            <button className={showCalendar ? "checkin-checkout focus" : "checkin-checkout"} onClick={toggleCalendar}><i className="ri-calendar-2-line"></i> {!checkIn ? "Check In" : formatDate(checkIn)} - {!checkOut ? "Check Out" : formatDate(checkOut)}</button>
            <div className={showCalendar ? "calendar-popup show" : "calendar-popup"}>
                <Calendar checkIn={checkIn} checkOut={checkOut} selectDates={selectDates}/>
            </div>
            <button className={showBookingDetails ? "booking-details-btn focus" : "booking-details-btn"} onClick={toggleBookingDetails}><i className="ri-group-fill"></i> {adults} adult · {children} child · {rooms} room</button>
            <div className={showBookingDetails ? "booking-details show" : "booking-details"}>
                <div className="booking-details-item">Adults <div className="details-btns-container"><button className="plus" onClick={handlePlusAdults} disabled={adults === 9}><i className="ri-add-line"></i></button><input type="number" className="details-input" value={adults} readOnly></input><button className="minus" onClick={handleMinusAdults} disabled={adults === 1}><i className="ri-subtract-line"></i></button></div></div>
                <div className="booking-details-item">Children <div className="details-btns-container"><button className="plus" onClick={handlePlusChildren} disabled={children === 9}><i className="ri-add-line"></i></button><input type="number" className="details-input" value={children} readOnly></input><button className="minus" onClick={handleMinusChildren} disabled={children === 0}><i className="ri-subtract-line"></i></button></div></div>
                <div className="booking-details-item">Rooms <div className="details-btns-container"><button className="plus" onClick={handlePlusRooms} disabled={rooms === 9}><i className="ri-add-line"></i></button><input type="number" className="details-input" value={rooms} readOnly></input><button className="minus" onClick={handleMinusRooms} disabled={rooms === 1}><i className="ri-subtract-line"></i></button></div></div>
                <button className="ready" onClick={toggleBookingDetails}>Ready</button>
            </div>
            <button className="search" onClick={() => {handleSearch(place)}}>Search</button>
        </div>
    </>)
}

export default HotelSearch;