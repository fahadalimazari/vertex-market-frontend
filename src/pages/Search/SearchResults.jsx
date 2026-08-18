import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom'
import { FiFilter, FiChevronRight, FiGrid, FiList, FiX } from 'react-icons/fi'
import axios from 'axios'
import FilterSidebar from '../../components/Search/FilterSidebar'
import EmptySearch from '../../components/Search/EmptySearch'
import ProductCard from '../../components/Products/ProductCard'
import SearchListCard from '../../components/Products/SearchListCard'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { slug: categorySlug, subSlug: subCategorySlug } = useParams() 
  const urlQuery = searchParams.get('q') || searchParams.get('search') || ''
  
  const [results, setResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [dynamicFilters, setDynamicFilters] = useState([])
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'relevance')
  const [loading, setLoading] = useState(true)

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  // Parse filters from URL
  const selectedFilters = useMemo(() => {
    const filters = {}
    for (const [key, value] of searchParams.entries()) {
      if (!['q', 'search', 'sort', 'page', 'categorySlug', 'subCategorySlug'].includes(key)) {
        filters[key] = value.split(',')
      }
    }
    return filters
  }, [searchParams])

  const activeFiltersCount = Object.keys(selectedFilters).reduce((acc, key) => acc + selectedFilters[key].length, 0)

  // Fetch Filters and Products dynamically based on URL params
  useEffect(() => {
    const fetchSearchData = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams()
        if (urlQuery) query.set('search', urlQuery)
        if (categorySlug) query.set('categorySlug', categorySlug)
        if (subCategorySlug) query.set('subCategorySlug', subCategorySlug)
        if (sortOrder && sortOrder !== 'relevance') query.set('sort', sortOrder)
        
        Object.keys(selectedFilters).forEach(key => {
          if (selectedFilters[key].length > 0) {
            query.set(key, selectedFilters[key].join(','))
          }
        })

        // Fetch Products
        const { data: productData } = await axios.get(`http://127.0.0.1:5000/api/v1/catalog/products?${query.toString()}`)
        
        // Fetch Faceted Filters for current context
        const { data: filterData } = await axios.get(`http://127.0.0.1:5000/api/v1/catalog/filters?${query.toString()}`)
        
        if (productData.success) {
          setResults(productData.data.products)
          setTotalResults(productData.data.pagination.total)
        }
        if (filterData.success) {
          setDynamicFilters(filterData.data)
        }
      } catch (err) {
        console.error('Failed to load search results', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSearchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery, categorySlug, subCategorySlug, sortOrder, searchParams]) // Depend on searchParams to refetch when filters change

  const updateURLParams = useCallback((newFilters, newSort) => {
    const currentParams = new URLSearchParams(searchParams)
    
    // Clear old filter params
    for (const key of Array.from(currentParams.keys())) {
      if (!['q', 'search', 'page', 'categorySlug', 'subCategorySlug'].includes(key)) {
        currentParams.delete(key)
      }
    }

    if (newSort && newSort !== 'relevance') {
      currentParams.set('sort', newSort)
    }

    Object.keys(newFilters).forEach(key => {
      if (newFilters[key].length > 0) {
        currentParams.set(key, newFilters[key].join(','))
      }
    })

    setSearchParams(currentParams)
  }, [searchParams, setSearchParams])

  const handleToggleFilter = (filterCode, optionValue) => {
    const newFilters = { ...selectedFilters }
    const current = newFilters[filterCode] || []
    
    if (current.includes(String(optionValue))) {
      newFilters[filterCode] = current.filter(v => v !== String(optionValue))
      if (newFilters[filterCode].length === 0) delete newFilters[filterCode]
    } else {
      newFilters[filterCode] = [...current, String(optionValue)]
    }
    updateURLParams(newFilters, sortOrder)
  }

  const removeFilter = (filterCode, optionValue) => {
    handleToggleFilter(filterCode, optionValue)
  }

  const clearAllFilters = () => {
    updateURLParams({}, sortOrder)
  }

  const handleSortChange = (e) => {
    const val = e.target.value
    setSortOrder(val)
    updateURLParams(selectedFilters, val)
  }

  const activeFilters = useMemo(() => {
    const active = []
    Object.keys(selectedFilters).forEach(code => {
      selectedFilters[code].forEach(val => {
        const group = dynamicFilters.find(g => g.code === code)
        const opt = group?.options.find(o => String(o.value) === String(val))
        active.push({ type: code, value: val, label: opt ? opt.label : val })
      })
    })
    return active
  }, [selectedFilters, dynamicFilters])

  return (
    <div className="flex-1 bg-[#f8f9fa] min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-[13px] font-medium text-gray-500 mb-3">
            <Link to="/" className="hover:text-[#ff6a00] transition-colors">Home</Link>
            <FiChevronRight />
            <Link to="/search" className="hover:text-[#ff6a00] transition-colors">Search</Link>
            <FiChevronRight />
            <span className="text-gray-900 truncate">"{urlQuery}"</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Results for "{urlQuery}"
              </h1>
              <p className="text-[14px] text-gray-500 mt-1">
                <strong className="text-gray-900">{totalResults}</strong> Products Found
              </p>
            </div>
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-gray-500">{activeFiltersCount} filters applied</span>
                <button 
                  onClick={clearAllFilters}
                  className="text-[13px] font-bold text-[#ff6a00] hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-start gap-6 lg:gap-8">
        
        {/* Sidebar */}
        <FilterSidebar 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)} 
          dynamicFilters={dynamicFilters}
          selectedFilters={selectedFilters}
          onToggleFilter={handleToggleFilter}
          loading={loading}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          
          {/* Top Controls Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-6">
            
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-[14px] font-bold text-gray-700"
            >
              <FiFilter /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* Active Filter Chips */}
            <div className="hidden sm:flex flex-1 flex-wrap items-center gap-2">
              {activeFilters.map((filter, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700">
                  {filter.label}
                  <button 
                    onClick={() => removeFilter(filter.type, filter.value)}
                    className="text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <select 
                value={sortOrder}
                onChange={handleSortChange}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-[13px] font-medium rounded-xl px-4 py-2 outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] cursor-pointer"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="highestRated">Highest Rated</option>
              </select>

              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus:outline-none ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                  title="Grid View"
                >
                  <FiGrid />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors focus:outline-none ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                  title="List View"
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid/List */}
          {loading ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" : "flex flex-col gap-4"}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`bg-white rounded-2xl p-4 animate-pulse ${viewMode === 'list' ? 'flex gap-6 h-[240px]' : 'h-[400px]'}`}>
                  <div className={`bg-gray-200 rounded-xl ${viewMode === 'list' ? 'w-[240px] h-full' : 'h-48 w-full mb-4'}`}></div>
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptySearch query={urlQuery} />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((product) => (
                <SearchListCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Placeholder */}
          {!loading && results.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button className="bg-white border border-gray-200 text-gray-900 font-bold px-8 py-3 rounded-xl hover:border-[#ff6a00] hover:text-[#ff6a00] transition-colors shadow-sm">
                Load More Products
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default SearchResults
