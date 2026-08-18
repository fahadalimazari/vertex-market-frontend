import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

import CartList from '../../components/Cart/CartList'
import CartSummary from '../../components/Cart/CartSummary'
import EmptyCart from '../../components/Cart/EmptyCart'
import SaveForLater from '../../components/Cart/SaveForLater'

// Reuse ProductSection for Recommended Products
import ProductSection from '../../components/Products/ProductSection'
import { products } from '../../data/products'

const Cart = () => {
  const { 
    cartItems, 
    savedItems,
    cartSummary,
    updateQuantity, 
    removeFromCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    moveToWishlist
  } = useCart()

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-gray-500 mt-4">
        <Link to="/" className="hover:text-[#ff6a00] transition-colors">Home</Link>
        <FiChevronRight />
        <span className="text-gray-900">Shopping Cart</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        Shopping Cart {cartItems.length > 0 && <span className="text-gray-400 text-xl font-normal">({cartItems.length})</span>}
      </h1>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 flex flex-col min-w-0">
            <CartList 
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onSaveForLater={saveForLater}
              onMoveToWishlist={moveToWishlist}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 min-w-0 w-full">
            <CartSummary summary={cartSummary} />
          </div>
        </div>
      )}

      {/* Save For Later */}
      <SaveForLater 
        items={savedItems}
        onMoveToCart={moveToCart}
        onRemove={removeSavedItem}
      />

      {/* Recommended Products */}
      <div className="mt-12">
        <ProductSection 
          title="You May Also Like"
          products={products.filter(p => p.isFeatured).slice(0, 4)} 
        />
      </div>
    </div>
  )
}

export default Cart
