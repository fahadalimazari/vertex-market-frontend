import { motion } from 'framer-motion';

const CategorySkeleton = () => {
  return (
    <div className="relative flex flex-col h-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 animate-pulse">
      <div className="absolute inset-0 z-0 bg-gray-800">
        <motion.div 
          className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        ></motion.div>
      </div>
      <div className="relative z-20 flex flex-col justify-end p-5 h-full min-h-[160px]">
        <div className="w-10 h-10 rounded-full bg-gray-700 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default CategorySkeleton;
