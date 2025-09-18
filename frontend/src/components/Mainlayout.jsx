import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import MobileBottomNav from './MobileBottomNav';
import MobileHeader from './MobileHeader';

const Mainlayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <MobileHeader 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* Desktop Sidebar */}
      <LeftSidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      {/* Main Content */}
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <Outlet/>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

export default Mainlayout;
