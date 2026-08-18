import { FiLoader } from 'react-icons/fi';

const RouteLoader = () => {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center">
      <FiLoader className="text-2xl text-orange-500 animate-spin mb-3" />
      <p className="text-gray-500 text-sm">Loading module...</p>
    </div>
  );
};

export default RouteLoader;
