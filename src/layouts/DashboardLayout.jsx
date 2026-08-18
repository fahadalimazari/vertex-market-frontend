import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { FiMenu, FiBell, FiChevronRight } from 'react-icons/fi'
import DashboardSidebar from '../components/Dashboard/DashboardSidebar'
import GlobalSearch from '../components/Dashboard/GlobalSearch'
import UserDropdown from '../components/Dashboard/UserDropdown'
import { DashboardProvider, useDashboard } from '../context/Dashboard/DashboardContext'

import NotificationBell from '../components/Notifications/NotificationBell'

const DashboardHeader = ({ setIsSidebarOpen, pathParts, currentPage }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-[#ff6a00] focus:outline-none rounded-lg hover:bg-gray-50"
        >
          <FiMenu className="text-2xl" />
        </button>
        
        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-[14px]">
          <Link to="/account" className="text-gray-500 font-medium hover:text-[#ff6a00]">Account</Link>
          {pathParts.length > 1 && (
            <>
              <FiChevronRight className="text-gray-400" />
              <span className="text-gray-900 font-bold">{currentPage}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:block w-64 lg:w-80">
          <GlobalSearch />
        </div>
        
        <NotificationBell />


        <div className="w-[1px] h-6 bg-gray-200 hidden sm:block"></div>

        <UserDropdown />
      </div>
    </header>
  )
}

const DashboardLayoutContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  // Generate simple breadcrumb based on path
  const pathParts = location.pathname.split('/').filter(Boolean)
  const currentPage = pathParts.length > 1 
    ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1)
    : 'Dashboard'

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on Desktop, Drawer on Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:translate-x-0 lg:w-64 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand / Logo Area for Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
          <Link to="/" className="text-2xl font-black text-gray-900 tracking-tighter">
            VERTEX<span className="text-[#ff6a00]">.</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto pt-4">
          <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
        
        <DashboardHeader 
          setIsSidebarOpen={setIsSidebarOpen} 
          pathParts={pathParts} 
          currentPage={currentPage} 
        />

        {/* Mobile Search (visible only on small screens below header) */}
        <div className="md:hidden p-4 bg-white border-b border-gray-100">
          <GlobalSearch />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  )
}

const DashboardLayout = () => {
  return (
    <DashboardProvider>
      <DashboardLayoutContent />
    </DashboardProvider>
  )
}

export default DashboardLayout
