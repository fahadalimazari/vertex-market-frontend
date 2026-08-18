import React, { useMemo } from 'react';
import { useProduct } from '../../../context/ProductContext';
import { ProductSlider } from './Recommendations';

const FrequentlyBoughtTogether = ({ product }) => {
  const { products } = useProduct();
  
  const relatedProducts = useMemo(() => {
    if (!products || !product) return [];

    // Filter out current product and inactive products
    let available = products.filter(p => 
      p._id !== product._id && 
      p.slug !== product.slug &&
      p.isActive !== false &&
      p.stock !== 0
    );

    // Deduplicate by ID
    const seen = new Set();
    available = available.filter(p => {
      if (seen.has(p._id)) return false;
      seen.add(p._id);
      return true;
    });

    // Score products to find best matches
    const scored = available.map(p => {
      let score = 0;
      
      // 1. Same Subcategory (Highest priority for related items)
      if (product.subCategory && p.subCategory === product.subCategory) {
        score += 50;
      }
      
      // 2. Same Category
      if (product.category && p.category === product.category) {
        score += 30;
      }

      // 3. Brand Match (sometimes people buy same brand accessories)
      if (product.brand && p.brand === product.brand) {
        score += 10;
      }

      // 4. Rating (Popularity tie-breaker)
      score += (p.rating || 0);

      return { product: p, score };
    });

    // Sort by score descending, take top 5
    scored.sort((a, b) => b.score - a.score);
    
    return scored.slice(0, 5).map(item => item.product);
  }, [products, product]);

  if (relatedProducts.length === 0) return null;

  return (
    <ProductSlider 
      title="Frequently Bought Together" 
      products={relatedProducts} 
    />
  );
};

export default FrequentlyBoughtTogether;
