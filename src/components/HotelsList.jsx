import React, { useState, useEffect } from "react";
import getCityInfo from "../requests/getCityInfo";
import getHotels from "../requests/getHotels";
import { formatDate } from "../assets/constants";
import MapComponent from "./MapComponent";

const getImage = (imageName) => {
    return new URL(`../assets/${imageName}.jpg`, import.meta.url).href;
};

const cityCode = async (cityName) => {
    const data = await getCityInfo(cityName);
    return data[0].iataCode;
};

const normalize = (text) => {
    return text.split(' ').map(elm => elm[0] + elm.slice(1, elm.length).toLowerCase()).join(' ')
}

const HotelsList = ({ place, isSearch, setSearch, showHotelsList }) => {
    const [list, setList] = useState([])
    const [startIndex, setStartIndex] = useState(0)
    const itemsPerPage = 50
    const [request, setRequest] = useState("")
    const [hotelsCountState, setHotelsCountState] = useState(0)
    const [isLoading, setLoading] = useState(false)
    const [activeHotelId, setActiveHotelId] = useState(null);

    useEffect(() => {
        if (!showHotelsList) {
            setHotelsCountState(0)
            setRequest("")
            setStartIndex(0)
            setList([])
        }
    }, [showHotelsList])

    useEffect(() => {
        const fetchHotels = async () => {
        try {
            setLoading(true)
            const code = await cityCode(place);
            const data = await getHotels(code);
            setList(data);
            setRequest(place)
            setHotelsCountState(data.length);
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
        }

        if (isSearch) {
            fetchHotels();
            setSearch(false)
            setStartIndex(0)
        }
    }, [place, isSearch]);


    const hotelsToDisplay = list.slice(startIndex, startIndex + itemsPerPage)

    const totalPages = Math.ceil(list.length / itemsPerPage);

    return (
        <>  
            <div className="hotels-page">
            <div className="hotels-list">
                <h1 className="hotels-found"> {isLoading ? `Search results for ${place}...`: `We found ${hotelsCountState} hotels by request ${request}.`}</h1>
                {isLoading ? <div className="spinner"><i className="ri-loader-4-line spinner-icon"></i></div> : <div className="hotels-items">
                    {hotelsToDisplay.map(({ name, hotelId, address, lastUpdate }) => {
                        return (
                            <div className="hotel-item" key={hotelId} id={`hotel-${hotelId}`} onMouseEnter={() => setActiveHotelId(hotelId)} onMouseLeave={() => setActiveHotelId(null)}>
                                <div className="hotel-image">
                                    <img src={getImage("Image-not-found")} alt="hotel-image"/>
                                </div>
                                <div className="hotel-info">
                                    <div className="hotel-header">
                                        <h2 className="hotel-title">{normalize(name)}</h2>
                                        <span className="hotel-address"><i className="ri-map-pin-2-line"></i> {request}, {address?.countryCode || "N/A"}</span>
                                    </div>
                                    <span>The latest update to the hotel information in the API: {formatDate(lastUpdate, "year")}</span>
                                    <span className="more-info">Click on card to see more information.</span>
                                </div>
                            </div>
                        );
                    })}
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => setStartIndex(i * itemsPerPage)} className={`page-btn ${startIndex / itemsPerPage === i ? 'active' : ''}`}>{i + 1}</button>))}
                    </div>
                </div>}
            </div>
            <div className="hotels-map">
                {!isLoading && <MapComponent hotelsList={hotelsToDisplay} request={request} activeHotelId={activeHotelId} />}
            </div>
            </div>
        </>
    );
};


export default HotelsList;
