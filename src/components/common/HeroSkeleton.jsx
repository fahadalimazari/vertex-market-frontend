import { motion } from 'framer-motion';

const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100 flex animate-pulse shadow-sm">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      ></motion.div>
      <div className="relative z-10 w-full h-full flex flex-col justify-center p-8 md:p-16 w-full md:w-1/2 space-y-6">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-12 md:h-16 bg-gray-300 rounded w-full"></div>
        <div className="h-12 md:h-16 bg-gray-300 rounded w-5/6"></div>
        <div className="h-5 bg-gray-300 rounded w-2/3"></div>
        <div className="flex gap-4 pt-4">
          <div className="h-12 w-32 bg-gray-300 rounded-xl"></div>
          <div className="h-12 w-32 bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
