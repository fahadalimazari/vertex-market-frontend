import React from 'react';
import { FiStar, FiCheckCircle, FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const getDisplayName = (field) => {
  if (!field) return null;
  if (typeof field === 'object') return field.name || '';
  return String(field);
};

const ProductInfo = ({ product, currentVariant, currentStock }) => {
  const brandName = getDisplayName(product.brand);
  const categoryName = getDisplayName(product.category);
  const sku = currentVariant?.sku || product.sku;
  const productName = getDisplayName(product.name);

  return (
    <>
      {/* Badges & Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        {brandName && (
          <span className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
            {product.brand?.logo && <img src={product.brand.logo} alt={brandName} className="h-4 w-4 object-contain" />}
            {brandName}
          </span>
        )}
        {categoryName && <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">{categoryName}</span>}
        {sku && <span className="text-gray-400">SKU: {sku}</span>}
        {product.condition && <span className="border border-gray-200 px-3 py-1 rounded-lg text-gray-600">{product.condition}</span>}
      </div>
      
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
        {productName}
      </h1>
      
      {/* Ratings & Social Proof */}
      <div className="flex flex-wrap items-center gap-4 text-sm mb-6 pb-6 border-b border-gray-100">
        <a href="#reviews" className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex text-yellow-400 text-base">
            {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-200'} />)}
          </div>
          <span className="font-black text-gray-900 ml-1">{Number(product.rating || 0).toFixed(1)}</span>
          <span className="text-gray-500 underline decoration-gray-300 underline-offset-4">({product.reviews || 0} Reviews)</span>
        </a>
        
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></div>
        
        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
          <FiCheckCircle className="text-green-500" />
          <span>{product.sold || 0} Sold</span>
        </div>

        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></div>

        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
          <FiPackage className="text-blue-500" />
          {currentStock > 0 ? (
            <span className="text-green-600 font-bold">In Stock ({currentStock})</span>
          ) : (
            <span className="text-red-500 font-bold">Out of Stock</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
