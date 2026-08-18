import { useCompare } from '../../context/CompareContext';
import CompareTable from '../../components/Compare/CompareTable';
import EmptyCompare from '../../components/Compare/EmptyCompare';
import { FiRepeat } from 'react-icons/fi';

const Compare = () => {
  const { compareItems } = useCompare();

  return (
    <div className="min-h-screen max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {compareItems.length >= 2 && (
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiRepeat className="text-[#ff6a00]" /> Product Comparison
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Analyze and compare specifications, reviews, and details side-by-side.
          </p>
        </div>
      )}

      {compareItems.length < 2 ? (
        <EmptyCompare />
      ) : (
        <CompareTable />
      )}
    </div>
  );
};

export default Compare;
