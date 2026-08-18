import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { products as allProducts } from '../data/products'
import { useAuth } from './AuthContext'

const SearchContext = createContext()

export const useSearch = () => useContext(SearchContext)

export const SearchProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth() || {}
  
  // Global Overlay State
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  
  // Search Query
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  
  // Storage State
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('vertex_search_v1')
    return saved ? JSON.parse(saved) : []
  })
  
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('vertex_viewed_v1')
    return saved ? JSON.parse(saved) : []
  })

  // Results State
  const [suggestions, setSuggestions] = useState({ products: [], categories: [], brands: [] })

  // Filter & Sort State (for Results Page)
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 500000],
    rating: 0
  })
  const [sortOrder, setSortOrder] = useState('relevance') // 'price-asc', 'price-desc', 'newest', 'rating'

  // Sync database search history & recently viewed to state when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.searchHistory) {
        setRecentSearches(user.searchHistory);
      }
      if (user.recentlyViewed) {
        const mapped = user.recentlyViewed
          .filter(item => item.productId)
          .map(item => ({
            ...item.productId,
            id: item.productId._id || item.productId.id
          }));
        setRecentlyViewed(mapped);
      }
    }
  }, [user, isAuthenticated]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const [isSearching, setIsSearching] = useState(false)

  // Live Suggestions based on debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions({ products: [], categories: [], brands: [] })
      setIsSearching(false)
      return
    }
    
    const fetchSearchResults = async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`http://localhost:5000/api/v1/catalog/products?search=${encodeURIComponent(debouncedQuery)}&limit=8`)
        const data = await response.json()
        
        if (data.success && data.data && data.data.products) {
          const matchingProducts = data.data.products
          // Extract unique categories and brands (if brand is populated)
          const uniqueCategories = [...new Set(matchingProducts.map(p => p.category).filter(Boolean))]
          const uniqueBrands = [...new Set(matchingProducts.map(p => typeof p.brand === 'object' && p.brand ? p.brand.name : p.brand).filter(Boolean))]
          
          setSuggestions({
            products: matchingProducts,
            categories: uniqueCategories,
            brands: uniqueBrands
          })
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
      } finally {
        setIsSearching(false)
      }
    }

    fetchSearchResults()
  }, [debouncedQuery])

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem('vertex_search_v1', JSON.stringify(recentSearches))
  }, [recentSearches])

  useEffect(() => {
    localStorage.setItem('vertex_viewed_v1', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  // Backend Sync Helpers
  const syncSearchToBackend = async (term) => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      await fetch('http://localhost:5000/api/v1/auth/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ search: term })
      });
    } catch (e) {
      console.error('Failed to sync search history', e);
    }
  };

  const clearSearchOnBackend = async () => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      await fetch('http://localhost:5000/api/v1/auth/search-history', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });
    } catch (e) {
      console.error('Failed to clear search history on backend', e);
    }
  };

  const syncRecentlyViewedToBackend = async (product) => {
    const sessionStr = localStorage.getItem('vertex_session_v1');
    if (!sessionStr) return;
    try {
      const session = JSON.parse(sessionStr);
      await fetch('http://localhost:5000/api/v1/auth/recently-viewed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ productId: product._id || product.id })
      });
    } catch (e) {
      console.error('Failed to sync recently viewed', e);
    }
  };

  // Actions
  const addRecentSearch = (term) => {
    if (!term.trim()) return
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase())
      return [term, ...filtered].slice(0, 10)
    })
    if (isAuthenticated) {
      syncSearchToBackend(term);
    }
  }

  const removeRecentSearch = (term) => {
    setRecentSearches(prev => prev.filter(t => t !== term))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    if (isAuthenticated) {
      clearSearchOnBackend();
    }
  }

  const addRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id && p._id !== product._id)
      return [product, ...filtered].slice(0, 10)
    })
    if (isAuthenticated) {
      syncRecentlyViewedToBackend(product);
    }
  }

  const executeSearch = (searchTerm) => {
    addRecentSearch(searchTerm)
    setIsOverlayOpen(false)
    setQuery(searchTerm)
    // The actual routing should happen in the component calling this.
    // e.g. navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }
  
  // Results Page Helper
  const getFilteredResults = useCallback(() => {
    let results = [...allProducts]

    // 1. Keyword search
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase()
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      )
    }

    // 2. Filters
    if (filters.categories.length > 0) {
      results = results.filter(p => filters.categories.includes(p.category))
    }
    if (filters.brands.length > 0) {
      results = results.filter(p => filters.brands.includes(p.brand))
    }
    if (filters.rating > 0) {
      results = results.filter(p => p.rating >= filters.rating)
    }
    results = results.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])

    // 3. Sort
    switch (sortOrder) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // Fake newest by reversing
        results.reverse()
        break
      default:
        // Relevance (no extra sort)
        break
    }

    return results
  }, [debouncedQuery, filters, sortOrder])

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type]
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(item => item !== value) }
      } else {
        return { ...prev, [type]: [...current, value] }
      }
    })
  }

  const removeFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 500000],
      rating: 0
    })
  }

  const value = {
    isOverlayOpen,
    setIsOverlayOpen,
    query,
    setQuery,
    debouncedQuery,
    isSearching,
    suggestions,
    recentSearches,
    removeRecentSearch,
    clearRecentSearches,
    recentlyViewed,
    addRecentlyViewed,
    executeSearch,
    filters,
    setFilters,
    toggleFilter,
    removeFilter,
    clearAllFilters,
    sortOrder,
    setSortOrder,
    getFilteredResults
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}
