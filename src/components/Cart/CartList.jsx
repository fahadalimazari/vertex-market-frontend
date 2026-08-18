import { memo } from 'react'
import CartItem from './CartItem'

const CartList = ({ items, onUpdateQuantity, onRemove, onSaveForLater, onMoveToWishlist }) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map(item => (
        <CartItem 
          key={item._id || item.productId?._id || item.productId} 
          item={item} 
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          onSaveForLater={onSaveForLater}
          onMoveToWishlist={onMoveToWishlist}
        />
      ))}
    </div>
  )
}

export default memo(CartList)
