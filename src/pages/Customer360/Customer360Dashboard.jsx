import { FiUser, FiShoppingBag, FiStar, FiHeart } from 'react-icons/fi';

const Customer360Dashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer 360</h1>
        <p className="text-gray-500">Unified view of customer behavior, purchase history, and AI loyalty predictions.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-gray-800">
              JD
            </div>
            <div>
              <h2 className="text-2xl font-bold">John Doe</h2>
              <p className="text-gray-400">john.doe@example.com • Member since 2024</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                <FiStar /> VIP Customer
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm mb-1">Lifetime Value</div>
            <div className="text-3xl font-bold">$4,250.00</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiShoppingBag className="text-orange-500" /> Recent Purchases
          </h3>
          <ul className="space-y-4">
            {[
              { item: 'MacBook Pro M3', date: 'Oct 12', price: '$2,400' },
              { item: 'Sony WH-1000XM5', date: 'Sep 28', price: '$350' },
            ].map((p, i) => (
              <li key={i} className="flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium text-gray-900">{p.item}</div>
                  <div className="text-gray-500">{p.date}</div>
                </div>
                <div className="font-bold">{p.price}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiHeart className="text-red-500" /> AI Preferences
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Electronics', 'Premium Audio', 'Fast Shipping', 'Tech Gadgets'].map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">AI predicts 85% probability of buying Apple accessories in next 30 days.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiStar className="text-yellow-500" /> Loyalty & Rewards
          </h3>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Reward Points</span>
              <span className="text-sm font-bold text-orange-600">1,250 pts</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors">
            View Reward History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customer360Dashboard;
