import { useState } from 'react'
import TopBar from './TopBar'
import MainNavbar from './MainNavbar'
import MobileMenu from './MobileMenu'
import MobileBottomNav from './MobileBottomNav'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        {/* Top Bar (Desktop only) */}
        <TopBar />
        
        {/* Main Navigation */}
        <MainNavbar onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />
        
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </header>
      
      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </>
  )
}

export default Navbar