import { FiSearch } from 'react-icons/fi'

const DashboardSearch = () => {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 text-lg" />
      </div>
      <input 
        type="text" 
        className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-colors shadow-sm"
        placeholder="Search orders, notifications, or settings..."
      />
    </div>
  )
}

export default DashboardSearch
