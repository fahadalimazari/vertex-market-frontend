import { useMemo } from 'react';
import { products as allProducts } from '../../data/products';
import ProductCard from '../Products/ProductCard';

const RecommendedProducts = ({ products }) => {
  // Map dummy IDs back to actual product objects
  const fullProducts = useMemo(() => {
    return products.map(p => {
      const match = allProducts.find(item => item.id === p.id);
      return { ...match, aiReason: p.aiReason };
    }).filter(p => p.name); // filter out undefined if ID not found
  }, [products]);

  if (fullProducts.length === 0) return null;

  return (
    <div className="flex gap-5 overflow-x-auto pb-4 snap-x hide-scrollbar">
      {fullProducts.map(product => (
        <div key={product.id} className="w-[265px] shrink-0 snap-start">
          <ProductCard product={product} showAIReason={true} />
        </div>
      ))}
    </div>
  );
};

export default RecommendedProducts;
