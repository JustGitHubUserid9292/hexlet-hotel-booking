import { useState } from 'react'
import CurrencySwitcher from './components/CurrencySwitcher'
import HotelSearch from './components/HotelSeach'
import UserLocationInfo from './components/UserLocationInfo'
import HomePageItems from './components/HomePageItems'
import ScrollToTopButton from './components/ScrolltoTopBtn'
import getHotels from './requests/getHotels'

const getLogo = (logoName) => {
  return new URL(`./assets/${logoName}.png`, import.meta.url).href;
}

function App() {
  const [currency, setCurrency] = useState("RUB")
  const [location, setLocation] = useState({ city: "", country: "" });
  const [place, setPlace] = useState("")
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [adults, setAdults] = useState(1)
  const [childrens, setChilderns] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)

  const handleChange = (e) => {
    setPlace(e.target.value)
  }

  return (
    <>
      <UserLocationInfo location={location} setLocation={setLocation}/>
      <div className='header'>
        <h1 className='title'>HotelBooking<span>.</span></h1>
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
          <button className='profile' onClick={() => setShowRegistration(true)}><i className="ri-user-3-line"></i></button>
          <button className='theme-switcher'><i className="ri-moon-line"></i></button>
        </div>
      </div>
      <div className="home-container">
        <h1 className='home-title'>Find accommodation for your new trip<span>Search for your dream hotel for your comfortable vacation.</span></h1>
        <HomePageItems currency={currency} setPlace={setPlace} showRegistration={showRegistration} setShowRegistration={setShowRegistration} showSignIn={showSignIn} setShowSignIn={setShowSignIn}/>
      </div>
      <ScrollToTopButton />
      <footer>
        <div className='footer-header'>
          <h1 className='footer-title'>HotelBooking<span>.</span></h1>
          <span className='footer-slogan'>Take a trip with us.</span>
          <span className='footer-rights'><i className="ri-copyright-line"></i> 2025 HotelBooking. All Rights Reserved.</span>
        </div>
        <div className='footer-credits'>
          <h1 className='credits-title'><img className='hexlet-logo' src={getLogo("hexlet-logo")} alt='hexlet-logo'></img> Hexlet Сollege</h1>
          <span className='credits-disc'>Diploma work by students of Hexlet College.</span>
          <a className='hexlet-url' href="https://hexly.ru/spb" target='_blank'>hexly.ru/spb</a>
        </div>
        <div className='footer-contacts'>
          <h1 className='contacts-title'>Support</h1>
          <h2 className='contacts-item'><p><i className="ri-phone-fill"></i> 8 (999) 345-67-89</p><span>Hotline (toll-free)</span></h2>
          <h2 className='contacts-item'><p><i className="ri-phone-fill"></i> 8 (999) 123-45-67</p><span>Customer Support</span></h2>
          <h2 className='contacts-item'><p><i className="ri-phone-fill"></i> 8 (999) 987-65-43</p><span>Technical Support</span></h2>
        </div>
        <div className='footer-btns'>
          <h1 className='btns-title'>Connect</h1>
          <a className="github" href="https://github.com/JustGitHubUserid9292/hexlet-hotel-booking" target='_blank'><i className="ri-github-fill"></i> Github</a>
          <a className="amadeus-api" href="https://developers.amadeus.com/" target='_blank'><i className="ri-community-fill"></i> Amadeus API</a>
          <a className='exchangerate-api' href="https://www.exchangerate-api.com/" target='_blank'><i className="ri-exchange-fill"></i> Exchangerate API</a>
        </div>
      </footer>
    </>
  )
}

export default App;
