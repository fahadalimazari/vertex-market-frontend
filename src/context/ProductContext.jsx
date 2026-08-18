import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProductContext = createContext(null);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reviews & Q&As states
  const [customReviews, setCustomReviews] = useState([]);
  const [customFaqs, setCustomFaqs] = useState([]);

  // Fetch products from Backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = 'http://127.0.0.1:5000/api/v1';
        const { data } = await axios.get(`${apiUrl}/products`);
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Error fetching products from backend:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const resetPDPState = useCallback(() => {
    setSelectedColor('');
    setSelectedStorage('');
    setSelectedSize('');
    setQuantity(1);
    setActiveImageIndex(0);
  }, []);

  const addCustomReview = useCallback((review) => {
    setCustomReviews(prev => [
      {
        id: `rev-custom-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        helpfulVotes: 0,
        isVerified: true,
        ...review
      },
      ...prev
    ]);

    // Update the products cache to reflect the new rating and review count
    setProducts(prevProducts => prevProducts.map(p => {
      if (p._id === review.productId) {
        const currentReviews = p.reviews || 0;
        const currentRating = p.rating || 0;
        
        const newReviewCount = currentReviews + 1;
        const totalRatingPoints = currentRating * currentReviews;
        const newAverageRating = (totalRatingPoints + review.rating) / newReviewCount;
        
        return {
          ...p,
          reviews: newReviewCount,
          rating: parseFloat(newAverageRating.toFixed(1))
        };
      }
      return p;
    }));

    toast.success('Review submitted successfully!');
  }, []);

  const addCustomQuestion = useCallback((questionData) => {
    setCustomFaqs(prev => [
      {
        id: `q-custom-${Date.now()}`,
        answer: 'Pending seller reply. Usually answers within 1 hour.',
        helpfulCount: 0,
        ...questionData
      },
      ...prev
    ]);
    toast.success('Question posted to merchant queue!');
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      categories,
      selectedColor,
      setSelectedColor,
      selectedStorage,
      setSelectedStorage,
      selectedSize,
      setSelectedSize,
      quantity,
      setQuantity,
      activeImageIndex,
      setActiveImageIndex,
      customReviews,
      addCustomReview,
      customFaqs,
      addCustomQuestion,
      resetPDPState
    }}>
      {children}
    </ProductContext.Provider>
  );
};
