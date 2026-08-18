const OrderFilters = ({ currentFilter, onFilterChange }) => {
  const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-[13px] font-bold transition-colors focus:outline-none ${
            currentFilter === filter 
              ? 'bg-[#ff6a00] text-white shadow-sm shadow-[#ff6a00]/20' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default OrderFilters
