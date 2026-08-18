import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const StickyBuyBar = ({ product, currentPrice, activeImage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdd = () => {
    addToCart({
      id: `${product.id}-sticky`,
      name: product.name,
      price: currentPrice,
      image: activeImage,
      quantity: 1,
      brand: product.brand,
      category: product.category
    });
    toast.success('Added to Cart!');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 py-3 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-slide-up flex items-center justify-between gap-4 max-w-7xl mx-auto rounded-t-2xl">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 bg-gray-50 border border-gray-100 rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
          <img src={activeImage} alt={product.name} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-xs truncate max-w-[150px] sm:max-w-md">{product.name}</p>
          <span className="text-[10px] text-[#ff6a00] font-bold block mt-0.5">Rs. {currentPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleAdd}
          className="bg-orange-50 hover:bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#ff6a00] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
        >
          Add to Cart
        </button>
        <button
          onClick={() => {
            handleAdd();
            window.location.href = '/checkout';
          }}
          className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md whitespace-nowrap"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default StickyBuyBar;
