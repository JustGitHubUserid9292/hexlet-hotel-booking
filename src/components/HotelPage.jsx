import React, { useState, useEffect } from "react";

const HotelPage = ({ isHotelPageShow, setShowHotelPage, hotelInfo }) => {
    const [currentInfo, setCurrentInfo] = useState([])

    const getImage = (imageName) => {
        return new URL(`../assets/${imageName}.jpg`, import.meta.url).href;
    };

    console.log(hotelInfo)

    const handleClickOutside = (e) => {
        if (isHotelPageShow && e.target.closest(".hotel-page-info") === null) setShowHotelPage(false)
    };

    useEffect(() => {
        setCurrentInfo(hotelInfo)
    }, [hotelInfo])

    useEffect(() => {
        if (isHotelPageShow) document.addEventListener("mousedown", handleClickOutside);
        
        else document.removeEventListener("mousedown", handleClickOutside);
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isHotelPageShow]);

    return (<>
        {currentInfo.map((elem) => {
        return <div className={isHotelPageShow ? "modal-overlay show" : "modal-overlay"}>
            <div key={elem.hotel.hotelId} className="hotel-page-info">
                <div className="hotel-page-image">
                    <img src={getImage("Image-not-found")} alt="hotel-page-image"/>
                </div>
                <div className="hotel-page-disc">
                    <h1 className="hotel-page-name">{elem.hotel.name}</h1>
                    {elem.offers.map((elem) => {
                        return <div className="hotel-window"><p className="hotel-page-description">{elem.room.description.text}</p><p className="hotel-page-price">{`${elem.price.currency}, ${elem.price.total}`}</p></div>
                    })}
                    <button className="hotel-reserve">Reserve</button>
                    </div>
                </div>
            </div>
        })}
        </>)
}

export default HotelPage;

