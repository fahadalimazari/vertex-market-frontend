import { motion } from 'framer-motion';
import { FiTool, FiArrowLeft } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const ComingSoon = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(p => p);
  const moduleName = pathParts.length > 0 ? pathParts[pathParts.length - 1].replace(/-/g, ' ') : 'Module';

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-sm"
      >
        <FiTool size={40} />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-black text-gray-900 mb-2 capitalize"
      >
        {moduleName} Module
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 mb-8 max-w-md font-medium text-sm leading-relaxed"
      >
        This module is currently under development for the Enterprise Admin upgrade. 
        It will be available in the upcoming Phase.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link 
          to="/admin/dashboard" 
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
