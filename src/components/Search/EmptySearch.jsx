import { useEffect, useState } from 'react'
import { FiMessageSquare, FiSearch } from 'react-icons/fi'
import axios from 'axios'
import { useAI } from '../../context/AIContext'
import ProductCard from '../../components/Products/ProductCard'

const EmptySearch = ({ query }) => {
  const { setIsOpen: setAIOpen, sendMessage } = useAI()
  const [trendingProducts, setTrendingProducts] = useState([])

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get('http://127.0.0.1:5000/api/v1/catalog/products?sort=featured&limit=8')
        if (data.success) {
          setTrendingProducts(data.data.products)
        }
      } catch (err) {
        console.error('Failed to fetch trending products', err)
      }
    }
    fetchTrending()
  }, [])

  const handleAskAI = () => {
    setAIOpen(true)
    setTimeout(() => {
      sendMessage(`I can't find anything for "${query}". Can you help me?`)
    }, 500)
  }

  // Suggest alternatives
  const getSuggestions = (query) => {
    if (!query) return []
    const q = query.toLowerCase()
    if (q.includes('samsng') || q.includes('sam')) return ['Samsung', 'Samsung Galaxy', 'Samsung Phones']
    if (q.includes('lap') || q.includes('lop')) return ['Laptop', 'Gaming Laptop', 'Lenovo Laptop']
    if (q.includes('gam')) return ['Gaming Monitor', 'Gaming Mouse', 'Gaming Laptop']
    return []
  }
  
  const suggestions = getSuggestions(query)

  return (
    <div className="flex flex-col py-10 w-full">
      <div className="flex flex-col items-center justify-center text-center mb-12 bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6">
          <FiSearch className="text-gray-300" />
        </div>
        
        <h2 className="text-[20px] font-bold text-gray-900 mb-2">No products found for "{query}"</h2>
        <p className="text-[14px] text-gray-500 mb-8 max-w-sm">
          We couldn't find any products matching your search. Try checking for typos or try one of the suggestions below.
        </p>

        {suggestions.length > 0 && (
          <div className="mb-8">
            <p className="text-[14px] font-bold text-gray-900 mb-3">Did you mean:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((sug, i) => (
                <a 
                  key={i} 
                  href={`/search?q=${sug}`}
                  className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ff6a00] hover:text-white hover:border-[#ff6a00] transition-colors"
                >
                  {sug}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 max-w-md w-full mx-auto">
          <h3 className="text-[15px] font-bold text-gray-900 mb-2">Can't find what you need?</h3>
          <p className="text-[13px] text-gray-600 mb-4">
            Our AI Shopping Assistant can help you discover products, compare items, and find alternatives.
          </p>
          <button 
            onClick={handleAskAI}
            className="w-full flex items-center justify-center gap-2 bg-[#ff6a00] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#e65c00] transition-colors focus:outline-none"
          >
            <FiMessageSquare /> Ask AI Shopping Assistant
          </button>
        </div>
      </div>

      {trendingProducts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Trending Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmptySearch
