import { useState } from 'react'
import getHotels from './requests/getHotels'

function App() {

  getHotels('LED').then((data) => console.log(data))

  return (
    <>
      <h1>Hello, World!</h1>
    </>
  )
}

export default App
