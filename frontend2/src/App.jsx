import React from 'react'
import { Button } from './components/ui/button'
import MainRoutes from './Routes/MainRoutes'
import Navbar from './components/navbar'
import Footer from './components/Footer'
import { useLocation } from 'react-router-dom'

const App = () => {
  const location = useLocation()
  const hiddenRoute = ['/login', '/register', '/dashboard']
  const shouldHideNavbar = hiddenRoute.some((route) => location.pathname.startsWith(route))
  const shouldHideFooter = shouldHideNavbar

  return (
    <div className='flex flex-col min-h-screen'>
      {!shouldHideNavbar && <Navbar />}
      
      <main className='flex-grow'>
        <MainRoutes />
      </main>

      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default App