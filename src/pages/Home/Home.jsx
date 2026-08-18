import Sidebar from '../../components/Categories/Sidebar';
import Hero from '../../components/home/Hero/Hero';
import TrustBadges from '../../components/home/TrustBadges';
import BottomFeatures from '../../components/home/BottomFeatures';
import ProductSection from '../../components/Products/ProductSection';
import RecommendedForYou from '../../components/Recommendations/RecommendedForYou';
import RecentlyViewedSlider from '../../components/Recommendations/RecentlyViewedSlider';
import { useProduct } from '../../context/ProductContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiZap, FiStar, FiAward, FiGift, FiCpu, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import TopStoresSection from '../../components/Stores/TopStoresSection';
import NewsletterForm from '../../components/Newsletter/NewsletterForm';
import FeaturedCategoriesGrid from '../../components/Categories/FeaturedCategoriesGrid';
import BundleDealsSection from '../../components/Products/BundleDealsSection';
import { getValidDeals } from '../../utils/dealCalculations';
import { useMemo } from 'react';

const Home = () => {
  const { products, loading } = useProduct();
  
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [arrivalsRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/v1/products/new-arrivals')
        ]);
        setNewArrivals(arrivalsRes.data.data || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchHomeData();
  }, []);
  
  const todaysDeals = useMemo(() => {
    return getValidDeals(products).slice(0, 10);
  }, [products]);
  
  // Filtering logic for remaining mock sections
  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const bundleDeals = products.filter(p => p.price > 100 && p.price < 500).slice(0, 10);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* 1. Hero Banner + Deal Cards */}
      <div className="flex gap-4 mt-2">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Hero Area */}
        <div className="flex-1 min-w-0">
          <Hero />
        </div>
      </div>
      
      {/* 2. Trust Features */}
      <TrustBadges />

      {/* 3. Featured Categories */}
      <FeaturedCategoriesGrid />

      {/* 3.5 New Arrivals */}
      {newArrivals.length > 0 && (
        <ProductSection 
          title={<div className="flex items-center gap-2"><FiTrendingUp className="text-blue-500" /> New Arrivals</div>} 
          description="Latest additions to the marketplace."
          products={newArrivals}
          viewAllLink="/products?filter=new-arrivals"
        />
      )}

      {/* 4. Today's Deals */}
      <ProductSection 
        title={<div className="flex items-center gap-2"><FiStar className="text-yellow-500" /> Today's Deals</div>} 
        description="Best prices on highly rated items."
        products={todaysDeals}
        viewAllLink="/products?filter=todays-deals"
        isLoading={loading}
      />
      


      {/* 6. AI Recommended For You */}
      <RecommendedForYou />

      {/* 7. Top Stores */}
      <section className="mb-12">
        <TopStoresSection />
      </section>

      {/* 8. Bundle Deals */}
      <BundleDealsSection />

      {/* 9. Recently Viewed */}
      <RecentlyViewedSlider />

      {/* 10. Newsletter */}
      <NewsletterForm />

      <BottomFeatures />
    </div>
  );
};

export default Home;
