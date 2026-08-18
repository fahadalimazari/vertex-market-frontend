import { Link } from 'react-router-dom';
import { FiRepeat } from 'react-icons/fi';

const EmptyCompare = () => {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm max-w-lg mx-auto">
      <div className="h-20 w-20 mx-auto mb-6 bg-orange-50 text-[#ff6a00] rounded-full flex items-center justify-center">
        <FiRepeat className="h-10 w-10 text-[#ff6a00]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Selected</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
        Please add at least 2 products to comparison in order to view side-by-side specifications.
      </p>
      <Link
        to="/products"
        className="inline-flex justify-center bg-[#ff6a00] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#e05e00] transition-colors shadow-md"
      >
        Select Products to Compare
      </Link>
    </div>
  );
};

export default EmptyCompare;
