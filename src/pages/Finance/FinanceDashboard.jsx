import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart } from 'react-icons/fi';

const mockTransactions = [
  { id: 1, type: 'Income', category: 'Marketplace Sales', amount: '+$45,200', date: 'Today' },
  { id: 2, type: 'Expense', category: 'AWS Hosting', amount: '-$1,200', date: 'Yesterday' },
  { id: 3, type: 'Income', category: 'SaaS Subscriptions', amount: '+$8,400', date: 'Yesterday' },
];

const FinanceDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Enterprise Finance</h1>
        <p className="text-gray-500">Real-time accounting, cash flow, and P&L tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-400">
            <FiDollarSign className="text-xl" />
            <span className="font-medium">Total Balance</span>
          </div>
          <div className="text-4xl font-bold">$1.24M</div>
          <div className="mt-4 text-sm text-green-400 flex items-center gap-1">
            <FiTrendingUp /> +14% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <FiTrendingUp className="text-xl text-green-500" />
            <span className="font-medium">Monthly Income</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">$184,200</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            <FiTrendingDown className="text-xl text-red-500" />
            <span className="font-medium">Monthly Expenses</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">$42,800</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <button className="text-orange-600 font-medium text-sm hover:text-orange-700">View All</button>
        </div>
        <div>
          {mockTransactions.map(tx => (
            <div key={tx.id} className="p-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'Income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {tx.type === 'Income' ? <FiTrendingUp /> : <FiTrendingDown />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{tx.category}</div>
                  <div className="text-xs text-gray-500">{tx.date}</div>
                </div>
              </div>
              <div className={`font-bold ${tx.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                {tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
