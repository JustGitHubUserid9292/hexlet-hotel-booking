import React, { useState, useEffect } from "react";
import { currencies } from "../assets/constants";

const CurrencySwitcher = ({ currency, setCurrency }) => {
    const currenciesList = Object.entries(currencies)
    const [isShow, setShow] = useState(false)
    const [activeCurrency, setActiveCurrency] = useState(currency);

    const toggleMenu = () => {
        setShow((prev) => !prev)
    }

    const handleClickOutside = (e) => {
        if (isShow && e.target.closest(".currency-menu") === null) setShow(false)
    };
    
    useEffect(() => {
        if (isShow) document.addEventListener("mousedown", handleClickOutside);

        else document.removeEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isShow]);

    return (
        <>
          <button className="currency" onClick={toggleMenu}>{currency}</button>
          <div className={isShow ? "modal-overlay show" : "modal-overlay"}>
            <div className="currency-menu">
                <div className="currency-menu-header">
                    <p className="currency-menu-disc">Сhoose a currency:</p>
                    <span className="close-btn" onClick={toggleMenu}><i className="ri-close-circle-fill"></i></span>
                </div>
                <div className="currency-menu-items">
                    {currenciesList.map(([cur, disc]) => {
                        return <a key={cur} className={activeCurrency === cur ? "currency-menu-item active" : "currency-menu-item"} onClick={() => { setCurrency(cur); setActiveCurrency(cur); setShow(false); }}>{cur}<span className="currency-disc">{disc}</span></a>
                    })}
                </div>
            </div>
          </div>
        </>
      );
};

export default CurrencySwitcher;

