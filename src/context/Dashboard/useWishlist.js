import { useState, useEffect } from 'react'
import { userWishlist as initialWishlist } from '../../data/wishlist'

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('vertex_wishlist_v1')
    return saved ? JSON.parse(saved) : initialWishlist
  })

  useEffect(() => {
    localStorage.setItem('vertex_wishlist_v1', JSON.stringify(wishlist))
  }, [wishlist])

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id))
  }

  const addToWishlist = (product) => {
    if (!wishlist.find(w => w.productId === product.productId)) {
      setWishlist(prev => [...prev, product])
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(w => w.productId === productId)
  }

  return { wishlist, removeFromWishlist, addToWishlist, isInWishlist }
}
