import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { FiX, FiRepeat } from 'react-icons/fi';

const CompareBar = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  // Only display if there are 2 or more items
  if (compareItems.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] py-4 px-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Count & Preview */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <FiRepeat className="text-[#ff6a00]" />
            <span>Comparing {compareItems.length} of 4 items</span>
          </div>

          <div className="flex items-center gap-3">
            {compareItems.map((item) => (
              <div key={item.id} className="relative group h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 p-1 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="absolute -top-1.5 -right-1.5 p-0.5 bg-gray-900 hover:bg-red-500 text-white rounded-full transition-colors shadow-sm"
                  title="Remove"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Navigation Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearCompare}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <Link
            to="/compare"
            className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Compare Now</span>
            <FiRepeat className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CompareBar;
