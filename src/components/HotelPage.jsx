import React, { useState, useEffect } from "react";

const HotelPage = ({ isHotelPageShow, setShowHotelPage }) => {

    const handleClickOutside = (e) => {
        if (isHotelPageShow && e.target.closest(".hotel-page-info") === null) setShowHotelPage(false)
    };
            
    useEffect(() => {
        if (isHotelPageShow) document.addEventListener("mousedown", handleClickOutside);
        
        else document.removeEventListener("mousedown", handleClickOutside);
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isHotelPageShow]);

    return (<>
        <div className={isHotelPageShow ? "modal-overlay show" : "modal-overlay"}>
            <div className="hotel-page-info">

            </div>
        </div>
        </>)
}

export default HotelPage;