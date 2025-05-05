import React, { useState, useEffect }from "react";
import { useNavigate, useLocation } from "react-router-dom";
import convertCurrency from "../requests/convertCurrency";
import { currenciesSymbols } from "../assets/constants";
import getHotelInfo from "../requests/getHotelInfo";


function generateFakeAddress(hotelName, city) {
    const streetNames = [
        "Main Street", "Grand Avenue", "Central Boulevard", "High Street", "Park Lane",
        "Liberty Road", "Sunset Drive", "Broadway", "Ocean View Road", "King's Way"
    ];
    const randomStreet = streetNames[Math.floor(Math.random() * streetNames.length)];
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    return `${hotelName}, ${randomNumber} ${randomStreet}, ${city}`;
}

const getImage = (imageName) => {
    return new URL(`../assets/${imageName}.jpg`, import.meta.url).href;
};

const getLogo = (logoName) => {
    return new URL(`../assets/${logoName}.png`, import.meta.url).href;
}

const formattedNumber = (num) => {
    return Number(num).toLocaleString("en-US", {
        maximumFractionDigits: 0
    });
};

const normalize = (text) => {
    return text && text.split(' ').map(elm => elm[0].toUpperCase() + elm.slice(1, elm.length).toLowerCase()).join(' ')
}

const categoryNormalize = (category) => {
    return category && category.split('_').map(elm => elm[0] + elm.slice(1, elm.length).toLowerCase()).join(' ')
}

const HotelOverview = ({ place, setPlace, currency, checkIn, checkOut, setCheckIn, setCheckOut, rooms, setRooms, adults, setAdults }) => {
    const [hotelId, setHotelId] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [currentInfo, setCurrentInfo] = useState([])
    const [active, setActive] = useState(false)
    const [price, setPrice] = useState("")
    const [fakeAddress, setFakeAddress] = useState("");

    const urlLocation = useLocation()

    const navigate = useNavigate()

    useEffect(() => {
        const currentHotelId = new URLSearchParams(urlLocation.search).get("hotelId") || "";
        const currentPlace = new URLSearchParams(urlLocation.search).get("place") || "";
        const currentCheckIn = new URLSearchParams(urlLocation.search).get("checkInDate") || "";
        const currentCheckOut = new URLSearchParams(urlLocation.search).get("checkOutDate") || "";
        const currentAdults = new URLSearchParams(urlLocation.search).get("adults") || "";
        const currentRooms = new URLSearchParams(urlLocation.search).get("roomQuantity") || "";
        
        if (currentPlace && currentPlace !== place) {
            setPlace(currentPlace);
        }
        if (currentCheckIn && currentCheckOut) {
            setCheckIn(currentCheckIn)
            setCheckOut(currentCheckOut)
        }
        if (currentAdults > 1 || currentRooms > 1) {
            setAdults(currentAdults)
            setRooms(currentRooms)
        }
        if (currentHotelId) {
            setHotelId(currentHotelId)
        }
        if (!currentHotelId) {
            navigate('/*')
        }
    }, [urlLocation.search])

    useEffect(() => {
            const fetchHotelInfo = async () => {
                try {
                    setLoading(true)
                    const currentCheckIn = checkIn && checkOut ? `&checkInDate=${checkIn}` : ""
                    const currentCheckOut = checkIn && checkOut ? `&checkOutDate=${checkOut}` : ""
                    const currentRooms = rooms > 1 ? `&roomQuantity=${rooms}` : ""
                    const currentAdults = adults > 1 ? `&adults=${adults}` : ""
                    const data = await getHotelInfo(hotelId, currentCheckIn, currentCheckOut, currentRooms, currentAdults);
                    const basePrice = data[0]?.offers[0].price.total
                    const baseCurrency = data[0]?.offers[0].price.currency
                    const convertPrice = basePrice && baseCurrency ? await convertCurrency(basePrice, baseCurrency, currency) : ""
                    setPrice(convertPrice)
                    setCurrentInfo(data);
                    setFakeAddress(generateFakeAddress(normalize(data[0]?.hotel.name), place));
                } catch (e) {
                    console.error(e)
                } finally {
                    setLoading(false)
                }
            }
            if (hotelId) {
                fetchHotelInfo()
            } else {
                setCurrentInfo([])
            }
        }, [hotelId, currency])

    console.log(currentInfo)

    return (<>
        <div className={`hotel-overview-wrapper ${isLoading ? "loading" : ""}`}>
            {!isLoading && <h1 className="hotel-overview-title">Hotel Overview</h1>}
            {isLoading ? <div className="spinner"><i className="ri-loader-4-line spinner-icon"></i></div> : currentInfo.map((elem => {
                return <div key={elem.hotel.hotelId} className="hotel-overview-data">
                    <div className="hotel-overview-image">
                        <img src={getImage("Image-not-found")} alt="hotel-page-image"/>
                    </div>
                    <div className="hotel-overview-data-wrapper">
                        <div className="hotel-overview-hotelname-header">
                            <h1 className="hotel-overview-hotelname">{normalize(elem.hotel.name)}</h1>
                            <span><i id="hotel-page-rating" className="ri-star-fill"></i> N/A · ID: {elem.hotel.hotelId}</span>
                            <span className="hotel-overview-hotelAddress"><i className="ri-map-pin-2-fill"></i> {fakeAddress}</span>
                        </div>
                        {elem.offers.map((elem) => {
                            return <div key={elem.id} className="hotel-overview-addinfo"><p className="hotel-overview-addinfo-title">Description of the available room:</p><p className="hotel-overview-description">{elem.room.description.text}</p><p className="hotel-overview-price">{`${currenciesSymbols[currency]}${formattedNumber(price)}`} <span>Total price based on the options you choose.</span></p></div>
                        })}
                        <div className="hotel-overview-btns-wrapper">
                            <button className="hotel-reserve" onClick={() => navigate(`/hotel-reserve?hotelId=${hotelId}`)}>Reserve</button>
                            <button type="button" className="hotel-add2wl" onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>{active ? <i className="ri-heart-fill"></i> : <i className="ri-heart-line"></i>}</button>
                        </div>
                        {elem.offers.map((elem) => {
                            return <div key={elem.id} className="hotel-overview-categories"><span>{elem.room.typeEstimated?.category && <i id="category-icon" className="ri-home-line"></i>} {categoryNormalize(elem.room.typeEstimated.category)} {elem.policies.guarantee && <i id="category-icon" className="ri-bank-card-line"></i>} {elem.policies.guarantee?.acceptedPayments.methods.map(method => categoryNormalize(method)).join(', ')}</span></div>
                        })}
                    </div>
                </div>
            }))}
            {!isLoading && <h1 className="hotel-overview-conveniences-title">Facilities and services</h1>}
            {!isLoading && (<div className="hotel-overview-conveniences">
                <div className="hotel-overview-conveniences-wrapper">
                    <h2 className="title">Most Popular Amenities and Services</h2>
                <div className="amenities-grid">
                <div className="amenity-section">
                    <h4>General</h4>
                <ul>
                    <li><i className="ri-wifi-line"></i> Free Wi-Fi</li>
                    <li><i className="ri-taxi-line"></i> Transfer</li>
                    <li><i className="ri-snowy-line"></i> Air Conditioning</li>
                    <li><i className="ri-cloud-off-line"></i> Non-Smoking Rooms</li>
                    <li><i className="ri-home-2-line"></i> Kitchen</li>
                    <li><i className="ri-parking-box-line"></i> Private Parking</li>
                </ul>
                </div>
                <div className="amenity-section">
                    <h4>Kitchen</h4>
                <ul>
                    <li><i className="ri-check-line"></i> Coffee Machine</li>
                    <li><i className="ri-check-line"></i> Toaster</li>
                    <li><i className="ri-check-line"></i> Stove</li>
                    <li><i className="ri-check-line"></i> Oven</li>
                    <li><i className="ri-check-line"></i> Microwave</li>
                    <li><i className="ri-check-line"></i> Fridge</li>
                    <li><i className="ri-check-line"></i> Electric Kettle</li>
                    <li><i className="ri-check-line"></i> Dishware</li>
                </ul>
                </div>
                <div className="amenity-section">
                    <h4>Bathroom</h4>
                <ul>
                    <li><i className="ri-check-line"></i> Towels</li>
                    <li><i className="ri-check-line"></i> Shower or Bathtub</li>
                    <li><i className="ri-check-line"></i> Hairdryer</li>
                    <li><i className="ri-check-line"></i> Private Bathroom</li>
                </ul>
                </div>
                <div className="amenity-section">
                    <h4>Bedroom</h4>
                <ul>
                    <li><i class="ri-hotel-bed-line"></i> Bed Linen</li>
                    <li><i class="ri-shirt-line"></i> Wardrobe</li>
                </ul>
                </div>
                <div className="amenity-section">
                    <h4>Leisure</h4>
                <ul>
                    <li><i className="ri-check-line"></i> Outdoor Pool</li>
                    <li><i className="ri-check-line"></i> Fitness Center</li>
                    <li><i className="ri-tv-2-line"></i> TV</li>
                    <li><i className="ri-plant-line"></i> Balcony</li>
                </ul>
                </div>
                <div className="amenity-section">
                    <h4>Other</h4>
                <ul>
                    <li><i className="ri-check-line"></i> Elevator</li>
                    <li><i className="ri-cloud-off-line"></i> No Smoking</li>
                    <li><i className="ri-team-line"></i> Staff speaks English</li>
                </ul>
                </div>
            </div>
            </div>
            </div>)}
            {!isLoading && <h1 className="hotel-overview-accommodation-conditions-title">Accommodation conditions</h1>}
            {!isLoading && (<div className="hotel-policy-container">
            <div className="hotel-policy-item">
                <i className="ri-login-box-line"></i>
            <div>
                <h4>Check-in</h4>
                <p>From 16:00</p>
                <small>Please let the property know when you’ll arrive.</small>
            </div>
            </div>
            <div className="hotel-policy-item">
                <i className="ri-logout-box-line"></i>
            <div>
                <h4>Check-out</h4>
                <p>Until 13:00</p>
            </div>
            </div>
            <div className="hotel-policy-item">
                <i className="ri-refund-2-line"></i>
            <div>
                <h4>Cancellation / Prepayment</h4>
                <p>Policies vary depending on your booking. Please check your dates for more details.</p>
            </div>
            </div>
            <div className="hotel-policy-item">
                <i className="ri-money-dollar-circle-line"></i>
            <div>
                <h4>Refundable Damage Deposit</h4>
                <p>10% of the room rate will be charged 7 days prior to arrival and refunded within 7 days of departure.</p>
            </div>
            </div>
            <div className="hotel-policy-item">
                <i className="ri-user-line"></i>
            <div>
                <h4>Age restriction</h4>
                <p>No age restriction for check-in.</p>
            </div>
            </div>
            <div className="hotel-policy-item">
                <i className="ri-bank-card-line"></i>
            <div>
                <h4>Cards accepted</h4>
                <p>VISA, MasterCard. Cash not accepted.</p>
            </div>
            </div>
            <div className="hotel-policy-item">
                <i className="ri-cloud-off-line"></i> 
            <div>
                <h4>Smoking</h4>
                <p>Smoking is not allowed.</p>
            </div>
            </div>
        </div>)}
        {!isLoading && <div class="sponsors-section">
            <div class="logos">
                <img src={getLogo("amadeus-logo")} alt="partner-logo" />
                <img src={getLogo("exchangerate-logo")} alt="partner-logo" />
            </div>
            </div>}
        </div></>)
}


export default HotelOverview;