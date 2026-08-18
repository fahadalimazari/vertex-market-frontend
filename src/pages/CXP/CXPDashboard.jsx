import { FiSmile, FiMeh, FiFrown, FiTrendingUp } from 'react-icons/fi';

const CXPDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Experience Platform (CXP)</h1>
        <p className="text-gray-500">Monitor Net Promoter Score (NPS), customer journeys, and satisfaction metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">Global NPS Score</div>
            <div className="text-4xl font-bold text-green-400">72</div>
          </div>
          <FiTrendingUp className="text-4xl text-gray-700" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-gray-500 text-sm mb-2">Customer Satisfaction (CSAT)</div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center"><FiSmile className="text-3xl text-green-500 mb-1"/> <span className="font-bold">85%</span></div>
            <div className="flex flex-col items-center"><FiMeh className="text-3xl text-yellow-500 mb-1"/> <span className="font-bold">12%</span></div>
            <div className="flex flex-col items-center"><FiFrown className="text-3xl text-red-500 mb-1"/> <span className="font-bold">3%</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="text-gray-500 text-sm mb-1">Total Reviews Today</div>
          <div className="text-3xl font-bold text-gray-900">1,204</div>
          <div className="text-sm text-green-500 mt-1">+5% vs yesterday</div>
        </div>
      </div>
    </div>
  );
};

export default CXPDashboard;
