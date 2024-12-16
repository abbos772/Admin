import React from 'react'
import { Outlet } from 'react-router-dom'

const Сustomers = () => {
  return (
    <div>Сustomers
        
              <div className="out">
              <Outlet/>
              </div>
    </div>
  )
}

export default Сustomers