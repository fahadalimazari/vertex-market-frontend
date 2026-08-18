import { memo } from 'react'
import { Link } from 'react-router-dom'

const FeaturedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="text-gray-400 mb-2">New products coming</div>
        <div className="text-[12px] text-gray-500">We're updating our catalog.</div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <h3 className="text-[15px] font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
        Popular Products
      </h3>
      <div className="space-y-4">
        {products.map((product) => (
          <Link 
            key={product.id}
            to={`/product/${product.id}`}
            className="flex items-start gap-3 group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 relative">
              <img 
                src={product.image} 
                alt={product.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="text-[12px] font-medium text-gray-800 line-clamp-2 group-hover:text-[#ff6a00] transition-colors leading-tight mb-1">
                {product.name}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-gray-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <span className="text-[10px] font-bold text-[#ff6a00] bg-orange-50 px-1 rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default memo(FeaturedProducts)
