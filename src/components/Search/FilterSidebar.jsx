import { useState } from 'react'
import { FiSliders, FiX, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const FilterSidebar = ({ isOpen, onClose, dynamicFilters = [], selectedFilters = {}, onToggleFilter, loading }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    rating: true,
    availability: true,
    discount: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const renderCheckboxList = (filterGroup) => {
    if (!filterGroup.options || filterGroup.options.length === 0) return null;
    
    return (
      <div className="flex flex-col gap-2.5">
        {filterGroup.options.map(option => {
          const isChecked = selectedFilters[filterGroup.code]?.includes(String(option.value)) || false;
          return (
            <label key={option.value} className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                isChecked
                  ? 'bg-[#ff6a00] border-[#ff6a00] text-white'
                  : 'border-gray-300 bg-white group-hover:border-[#ff6a00]'
              }`}>
                {isChecked && <FiCheck className="text-[10px]" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={isChecked}
                onChange={() => onToggleFilter(filterGroup.code, option.value)}
              />
              <span className={`text-[13px] leading-tight flex-1 transition-colors ${isChecked ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {option.label}
              </span>
              {option.count > 0 && (
                <span className="text-[12px] text-gray-400 shrink-0">({option.count})</span>
              )}
            </label>
          );
        })}
      </div>
    )
  }

  // Find min and max for price range if it exists
  const priceFilter = dynamicFilters.find(f => f.code === 'price' && f.isRange)

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:relative lg:transform-none lg:shadow-none lg:w-[260px] lg:z-auto lg:border lg:border-gray-100 lg:rounded-2xl shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
            <FiSliders className="text-gray-400" /> Filters
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
          >
            <FiX />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-60px)] lg:h-auto overflow-y-auto custom-scrollbar p-5 gap-6">
          
          {loading ? (
            // Skeleton Loader
            [...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex gap-3">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : dynamicFilters.length === 0 ? (
            <div className="text-[13px] text-gray-500 text-center py-4">
              No filters available
            </div>
          ) : (
            dynamicFilters.map((filterGroup) => {
              
              if (filterGroup.code === 'price' && filterGroup.isRange) {
                return (
                  <div key={filterGroup.code} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <button 
                      onClick={() => toggleSection(filterGroup.code)}
                      className="w-full flex items-center justify-between text-[14px] font-bold text-gray-900 mb-4 focus:outline-none"
                    >
                      {filterGroup.attribute}
                      {expandedSections[filterGroup.code] ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                    </button>
                    {expandedSections[filterGroup.code] && (
                      <div className="px-1">
                        <div className="flex items-center gap-3">
                          <input type="number" placeholder="Min" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none focus:border-[#ff6a00]" defaultValue={filterGroup.min} />
                          <span className="text-gray-400">-</span>
                          <input type="number" placeholder="Max" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none focus:border-[#ff6a00]" defaultValue={filterGroup.max} />
                        </div>
                        <button className="w-full mt-3 bg-gray-900 text-white text-[13px] font-bold py-2 rounded-lg hover:bg-[#ff6a00] transition-colors">
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div key={filterGroup.code} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <button 
                    onClick={() => toggleSection(filterGroup.code)}
                    className="w-full flex items-center justify-between text-[14px] font-bold text-gray-900 mb-4 focus:outline-none"
                  >
                    {filterGroup.attribute}
                    {expandedSections[filterGroup.code] ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                  </button>
                  {expandedSections[filterGroup.code] && renderCheckboxList(filterGroup)}
                </div>
              )
            })
          )}

        </div>
      </div>
    </>
  )
}

export default FilterSidebar
