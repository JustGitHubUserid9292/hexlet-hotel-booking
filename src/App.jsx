import { useState } from 'react'
import CurrencySwitcher from './components/CurrencySwitcher'
import HotelSearch from './components/HotelSeach'
import UserLocationInfo from './components/UserLocationInfo'
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
    </>
  )
}

export default App
