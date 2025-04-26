import React, { useState, useEffect } from "react";
import convertCurrency from "../requests/convertCurrency";
import { currenciesSymbols } from "../assets/constants";
import getHotelInfo from "../requests/getHotelInfo";
import { useNavigate } from 'react-router-dom';

const HotelPage = ({ isHotelPageShow, setShowHotelPage, hotelData, currency, checkIn, checkOut, rooms, adults }) => {
    const [currentInfo, setCurrentInfo] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isEmpty, setEmpty] = useState(false)
    const [active, setActive] = useState(false)
    const [price, setPrice] = useState("")
    const [error, setError] = useState([])

    const getImage = (imageName) => {
        return new URL(`../assets/${imageName}.jpg`, import.meta.url).href;
    };

    const normalize = (text) => {
        return text && text.split(' ').map(elm => elm[0].toUpperCase() + elm.slice(1, elm.length).toLowerCase()).join(' ')
    }

    const categoryNormalize = (category) => {
        return category && category.split('_').map(elm => elm[0] + elm.slice(1, elm.length).toLowerCase()).join(' ')
    }

    const formattedNumber = (num) => {
        return Number(num).toLocaleString("en-US", {
            maximumFractionDigits: 0
        });
    };

    const handleClickOutside = (e) => {
        if (isHotelPageShow && e.target.closest(".hotel-page-info") === null) setShowHotelPage(false)
    };

    const navigate = useNavigate()

    useEffect(() => {
        const fetchHotelInfo = async () => {
            try {
                setLoading(true)
                const currentCheckIn = checkIn && checkOut ? `&checkInDate=${checkIn}` : ""
                const currentCheckOut = checkIn && checkOut ? `&checkOutDate=${checkOut}` : ""
                const currentRooms = rooms > 1 ? `&roomQuantity=${rooms}` : ""
                const currentAdults = adults > 1 ? `&adults=${adults}` : ""
                const data = await getHotelInfo(hotelData, currentCheckIn, currentCheckOut, currentRooms, currentAdults);
                const basePrice = data[0]?.offers[0].price.total
                const baseCurrency = data[0]?.offers[0].price.currency
                const convertPrice = basePrice && baseCurrency ? await convertCurrency(basePrice, baseCurrency, currency) : ""
                setPrice(convertPrice)
                setCurrentInfo(data);
            } catch (e) {
                setEmpty(true)
                setError(e)
            } finally {
                setLoading(false)
            }
        }
        if (isHotelPageShow && !isEmpty) {
            fetchHotelInfo()
        } else { 
            setEmpty(false)
            setError([])
            setCurrentInfo([])
        }
    }, [isHotelPageShow])

    useEffect(() => {
        if (isHotelPageShow) document.addEventListener("mousedown", handleClickOutside);
        
        else document.removeEventListener("mousedown", handleClickOutside);
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isHotelPageShow]);

    return (<>
        <div className={isHotelPageShow ? "modal-overlay show" : "modal-overlay"}>
        {isLoading ? <div className="spinner"><i className="ri-loader-4-line spinner-icon"></i></div> : !isEmpty ? currentInfo.map((elem) => {
        return <div key={elem.hotel.hotelId} className="hotel-page-info">
                    <div className="hotel-page-image">
                        <img src={getImage("Image-not-found")} alt="hotel-page-image"/>
                    </div>
                    <div className="hotel-page-text-wrapper">
                        <div className="hotel-page-data">
                            <h1 className="hotel-page-name">{normalize(elem.hotel.name)}</h1>
                            <span><i id="hotel-page-rating" className="ri-star-fill"></i> N/A · ID: {elem.hotel.hotelId}</span>
                        </div>  
                        {elem.offers.map((elem) => {
                            return <div key={elem.id} className="hotel-page-addinfo"><p className="hotel-page-addinfo-title">Description of the available room:</p><p className="hotel-page-description">{elem.room.description.text}</p><p className="hotel-page-price">{`${currenciesSymbols[currency]}${formattedNumber(price)}`} <span>Total price based on the options you choose.</span></p></div>
                        })}
                        <div className="hotel-page-btns-wrapper">
                            <button className="hotel-reserve" onClick={() => { navigate(`/hotel-reserve?offerId=${elem.hotel.hotelId}`); setShowHotelPage(false)}}>Reserve</button>
                            <button className="hotel-add2wl" onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>{active ? <i className="ri-heart-fill"></i> : <i className="ri-heart-line"></i>}</button>
                        </div>
                        {elem.offers.map((elem) => {
                            return <div key={elem.id} className="hotel-room-categories"><span>{elem.room.typeEstimated?.category && <i id="category-icon" className="ri-home-line"></i>} {categoryNormalize(elem.room.typeEstimated.category)} {elem.policies.guarantee && <i id="category-icon" className="ri-bank-card-line"></i>} {elem.policies.guarantee?.acceptedPayments.methods.map(method => categoryNormalize(method)).join(', ')}</span></div>
                        })}
                    </div>
                </div>
            }) : <div className="hotel-page-error"><i id="hotel-page-error-icon" className="ri-error-warning-line"></i><h1>{error.status}</h1><span>{error.detail}</span><button>Close</button></div>}
            </div>
        </>)
}

export default HotelPage;

