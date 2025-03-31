import { useState } from 'react'
import CurrencySwitcher from './components/CurrencySwitcher'
import HotelSearch from './components/HotelSeach'
import UserLocationInfo from './components/UserLocationInfo'
import HomePageItems from './components/HomePageItems'
import getHotels from './requests/getHotels'

function App() {
  const [currency, setCurrency] = useState("RUB")
  const [location, setLocation] = useState({ city: "", country: "" });
  const [place, setPlace] = useState("")
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [adults, setAdults] = useState(1)
  const [childrens, setChilderns] = useState(0)
  const [rooms, setRooms] = useState(1)

  const handleChange = (e) => {
    setPlace(e.target.value)
  }

  return (
    <>
      <UserLocationInfo location={location} setLocation={setLocation}/>
      <div className='header'>
        <h1 className='title'>HotelBooking.</h1>
        <HotelSearch 
        handleChange={handleChange} 
        location={location} 
        place={place} 
        setPlace={setPlace} 
        checkIn={checkIn} 
        setCheckIn={setCheckIn} 
        checkOut={checkOut} 
        setCheckOut={setCheckOut} 
        adults={adults} 
        setAdults={setAdults} 
        childrens={childrens} 
        setChilderns={setChilderns} 
        rooms={rooms} 
        setRooms={setRooms} 
        />
        <div className='site-config'>
          <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
          <button className='theme-switcher'><i className="ri-moon-line"></i></button>
        </div>
      </div>
      <div className="home-container">
        <h1 className='home-title'>Find accommodation for your new trip<span>Search for your dream hotel for your comfortable vacation.</span></h1>
        <HomePageItems currency={currency} setPlace={setPlace}/>
      </div>
    </>
  )
}

export default App
