import { motion } from 'framer-motion';

const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden p-4 flex flex-col w-full h-full shadow-sm">
      <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg animate-pulse w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
      
      <div className="flex-1"></div>
      
      <div className="h-2 bg-gray-100 rounded-full w-full mb-4 overflow-hidden">
        <motion.div 
          className="h-full bg-gray-200"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        ></motion.div>
      </div>
      <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse"></div>
    </div>
  );
};

export default ProductSkeleton;
