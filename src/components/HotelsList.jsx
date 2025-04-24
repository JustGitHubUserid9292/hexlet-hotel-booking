import React, { useState, useEffect } from "react";
import getCityInfo from "../requests/getCityInfo";
import getHotels from "../requests/getHotels";
import { formatDate } from "../assets/constants";
import MapComponent from "./MapComponent";
import { useNavigate, useLocation } from "react-router-dom";
import getHotelInfo from "../requests/getHotelInfo";
import HotelPage from "./HotelPage";

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

const HotelsList = ({ place, setPlace, isSearch, setSearch }) => {
    const [list, setList] = useState([])
    const [startIndex, setStartIndex] = useState(0)
    const itemsPerPage = 50
    const [request, setRequest] = useState("")
    const [hotelsCountState, setHotelsCountState] = useState(0)
    const [isLoading, setLoading] = useState(false)
    const [activeHotelId, setActiveHotelId] = useState(null);
    const [hotelName, setHotelName] = useState("")
    const [isEmpty, setEmpty] = useState(false)
    const [hotelInfo, setHotelInfo] = useState([])
    const [isHotelPageShow, setShowHotelPage] = useState(false)

    const urlLocation = useLocation()

    const navigate = useNavigate()

    useEffect(() => {
        const currentPlace = new URLSearchParams(urlLocation.search).get("place") || "";
    
        if (currentPlace && currentPlace !== place) {
            setPlace(currentPlace);
            setSearch(true);
        }
        if (!currentPlace) {
            navigate('/*')
        }
    }, [urlLocation.search]);

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
            setRequest(place)
            setEmpty(true)
        } finally {
            setLoading(false)
        }
        }

        if (isSearch) {
            fetchHotels()
            setEmpty(false)
            setSearch(false)
            setStartIndex(0)
        }
    }, [place, isSearch]);

    const handleChange = (e) => {
        setHotelName(e.target.value)
        setStartIndex(0)
    }

    const filteredList = list.filter(hotel => normalize(hotel.name).toLowerCase().includes(hotelName.toLowerCase()));

    const hotelsToDisplay = filteredList.slice(startIndex, startIndex + itemsPerPage)

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const inputFocus = () => {
        const input = document.querySelector(".search-input");
        input?.focus();
        input?.click()
    }

    const handleGetHotelInfo = async (hotelId) => {
        const data = await getHotelInfo(hotelId)
        setHotelInfo(data)
    }

    return (
        <>  
            {isEmpty && <div className="nothing-found"><i id="nothing-found-icon" className="ri-search-line"></i><h1>{request}: nothing found<span>We didn't find any accommodation according to your search criteria. Try changing them.</span></h1><button onClick={inputFocus}>Change search criteria</button></div>}
            <div className="hotels-page">
            <div className="hotels-list">
                {!isEmpty && <h1 className="hotels-found"> {isLoading ? `Search results for ${place}...`: `We found ${hotelsCountState} hotels by request ${request}.`}</h1>}
                {isLoading ? <div className="spinner"><i className="ri-loader-4-line spinner-icon"></i></div> : !isEmpty && <div className="hotels-items">
                    <div className="hotels-list-search-wrapper"><i id="hotels-list-search-icon" className="ri-search-line"></i><input type="text" className="hotels-list-search" value={hotelName} placeholder="Looking for a hotel?" onChange={handleChange} /></div>
                    {hotelsToDisplay.map(({ name, hotelId, address, lastUpdate }) => {
                        return (
                            <div className="hotel-item" key={hotelId} id={`hotel-${hotelId}`} onClick={() => { handleGetHotelInfo(hotelId); setShowHotelPage(true)}} onMouseEnter={() => setActiveHotelId(hotelId)} onMouseLeave={() => setActiveHotelId(null)}>
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
                    <HotelPage isHotelPageShow={isHotelPageShow} setShowHotelPage={setShowHotelPage} hotelInfo={hotelInfo}/>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => setStartIndex(i * itemsPerPage)} className={`page-btn ${startIndex / itemsPerPage === i ? 'active' : ''}`}>{i + 1}</button>))}
                    </div>
                </div>}
            </div>
            {!isEmpty && <div className="hotels-map">
                {!isLoading && <MapComponent hotelsList={hotelsToDisplay} request={request} activeHotelId={activeHotelId} />}
            </div>}
            </div>
        </>
    );
};


export default HotelsList;
