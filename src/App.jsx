import React, { useState, useEffect } from 'react'
import CurrencySwitcher from './components/CurrencySwitcher'
import HotelSearch from './components/HotelSeach'
import UserLocationInfo from './components/UserLocationInfo'
import HomePageItems from './components/HomePageItems'
import ScrollToTopButton from './components/ScrolltoTopBtn'
import RegistrationForm from "./components/RegistrationForm";
import SignInForm from "./components/SignInForm";
import HotelsList from './components/HotelsList'
import { Routes, Route, useNavigate } from 'react-router-dom'

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
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [isSearch, setSearch] = useState(false)

  const navigate = useNavigate()

  const handleClickOutside = (e) => {
          if (showRegistration && e.target.closest(".registration-form") === null) {
              setShowRegistration(false);
          }
          if (showSignIn && e.target.closest(".signin-form") === null) {
              setShowSignIn(false);
          }
      };
      
  useEffect(() => {
      if (showSignIn || showRegistration) {
          document.addEventListener("mousedown", handleClickOutside);
      } else {
          document.removeEventListener("mousedown", handleClickOutside);
      }
      
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [showSignIn, showRegistration]);

  const handleChange = (e) => {
    setPlace(e.target.value)
  }

  return (
    <>
      <UserLocationInfo location={location} setLocation={setLocation}/>
      <div className='header'>
        <h1 className='title' title='Home' onClick={() => navigate('/')}>HotelBooking<span>.</span></h1>
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
        children={children} 
        setChildren={setChildren} 
        rooms={rooms} 
        setRooms={setRooms}
        setSearch={setSearch}
        />
        <div className='site-config'>
          <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
          <button className='profile' onClick={() => setShowRegistration(true)}><i className="ri-user-3-line"></i></button>
          <button className='theme-switcher'><i className="ri-moon-line"></i></button>
        </div>
      </div>
      <Routes>
        <Route path="/"
          element={
            <div className="home-container">
              <h1 className='home-title'>
                Find accommodation for your new trip
                <span>Search for your dream hotel for your comfortable vacation.</span>
              </h1>
              <HomePageItems
                currency={currency}
                setPlace={setPlace}
                setShowRegistration={setShowRegistration}
                setShowSignIn={setShowSignIn}
              />
            </div>
          }
        />
        <Route path="/hotels-list" element={ <HotelsList place={place} setPlace={setPlace} isSearch={isSearch} setSearch={setSearch} currency={currency} checkIn={checkIn} checkOut={checkOut} setCheckIn={setCheckIn} setCheckOut={setCheckOut} rooms={rooms} setRooms={setRooms} adults={adults} setAdults={setAdults} /> }/>
        <Route path="*" element={<div className="page-not-found"><h1><i id="page-not-found-icon" className="ri-pages-line"></i>Page not found</h1><button onClick={() => navigate("/")}>Go home</button></div>}></Route>
      </Routes>
      <RegistrationForm setShowRegistration={setShowRegistration} setShowSignIn={setShowSignIn} showRegistration={showRegistration} />
      <SignInForm showSignin={showSignIn} setShowSignIn={setShowSignIn} />
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
