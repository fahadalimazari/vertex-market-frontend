import { FiLoader } from 'react-icons/fi';

const PageLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4">
        <FiLoader className="text-3xl text-orange-500 animate-spin" />
      </div>
      <h2 className="text-gray-900 font-bold text-lg">Vertex Market</h2>
      <p className="text-gray-500 text-sm">Loading Experience...</p>
    </div>
  );
};

export default PageLoader;
