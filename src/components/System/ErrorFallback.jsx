import { FiAlertOctagon, FiRefreshCw } from 'react-icons/fi';

const ErrorFallback = ({ error }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 bg-gray-50 rounded-2xl border border-red-100 my-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertOctagon className="text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 text-sm mb-6">
          {error?.message || "An unexpected error occurred in this component."}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm"
        >
          <FiRefreshCw />
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
