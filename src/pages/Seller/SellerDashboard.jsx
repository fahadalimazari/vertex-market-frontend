import { useInventory } from '../../context/InventoryContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { FiPackage, FiShoppingCart, FiTrendingUp, FiCreditCard, FiAlertCircle, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const { sellerProducts } = useInventory();
  const { sellerOrders, earnings } = useAnalytics();

  // Aggregate stats
  const activeProducts = sellerProducts.filter(p => p.isActive).length;
  const pendingOrders = sellerOrders.filter(o => o.status === 'Pending').length;
  const completedOrders = sellerOrders.filter(o => o.status === 'Delivered').length;

  // Inventory Health logic
  const lowStockThreshold = 10;
  const lowStockProducts = sellerProducts.filter(p => p.stock < lowStockThreshold);
  const outOfStockProducts = sellerProducts.filter(p => p.stock === 0);

  // Simulated Product Approval logic
  const pendingApprovalProducts = sellerProducts.filter(p => p.status === 'Pending Review');
  const rejectedProducts = sellerProducts.filter(p => p.status === 'Rejected');

  const statCards = [
    { title: 'Total Catalog Products', value: sellerProducts.length, desc: `${activeProducts} Active Listings`, icon: FiPackage, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending Shipments', value: pendingOrders, desc: `${completedOrders} Completed Orders`, icon: FiShoppingCart, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Total Revenue Generated', value: `Rs. ${earnings.total.toLocaleString()}`, desc: `Commission deducted`, icon: FiTrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Available Balance', value: `Rs. ${earnings.available.toLocaleString()}`, desc: `Ready for withdrawal`, icon: FiCreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  // Dummy monthly analytics data for custom bar representation
  const monthlySales = [
    { month: 'Jan', sales: 45, revenue: 120000 },
    { month: 'Feb', sales: 60, revenue: 180000 },
    { month: 'Mar', sales: 85, revenue: 240000 },
    { month: 'Apr', sales: 70, revenue: 210000 },
    { month: 'May', sales: 90, revenue: 270000 },
    { month: 'Jun', sales: 110, revenue: 320000 },
    { month: 'Jul', sales: 135, revenue: 410000 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Seller Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time performance analytics and store summary.</p>
        </div>
        <Link to="/seller/products?action=add" className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm w-full sm:w-auto text-center">
          + Add New Product
        </Link>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group min-w-0">
              <div className="space-y-1 pr-2 min-w-0 flex-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate">{stat.title}</p>
                <h3 className="text-xl font-black text-gray-900 truncate">{stat.value}</h3>
                <p className="text-[10px] text-gray-500 font-semibold truncate">{stat.desc}</p>
              </div>
              <div className={`p-3.5 sm:p-4 rounded-2xl ${stat.bg} ${stat.color} text-xl sm:text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon />
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Sales Chart Widget */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">Monthly Sales Volume</h3>
              <p className="text-[10px] text-gray-400 uppercase font-semibold truncate">Units sold per month</p>
            </div>
            <span className="text-xs font-bold text-[#ff6a00] bg-orange-50 px-2.5 py-1 rounded-lg shrink-0 whitespace-normal sm:whitespace-nowrap">+22.4% MoM</span>
          </div>

          {/* Custom Styled Responsive Bars Chart */}
          <div className="h-56 sm:h-60 flex items-end justify-between gap-1 sm:gap-2.5 pt-4 w-full overflow-x-auto hide-scrollbar">
            {monthlySales.map((item, idx) => {
              // Map sales number (max 150) to percentage height (max 100)
              const heightPct = Math.min((item.sales / 150) * 100, 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer min-w-[32px]">
                  <div className="relative w-full bg-gray-50 rounded-lg h-40 sm:h-44 flex items-end overflow-hidden border border-gray-100">
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-[#ff6a00] hover:bg-[#e05e00] rounded-b-md transition-all duration-500 group-hover:scale-x-105"
                    />
                    {/* Tooltip Overlay */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal sm:whitespace-nowrap z-10 shadow-sm hidden sm:block">
                      {item.sales} units
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 truncate w-full text-center">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Share Widget */}
        <div className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between min-w-0">
          <div className="border-b border-gray-50 pb-3">
            <h3 className="text-sm font-bold text-gray-900">Revenue Analysis</h3>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Monthly payout distribution</p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center py-2">
            {monthlySales.slice(-4).map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span className="truncate pr-2">{item.month} Earnings</span>
                  <span className="font-bold shrink-0">Rs. {item.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${Math.min((item.revenue / 500000) * 100, 100)}%` }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/seller/earnings"
            className="w-full text-center border border-gray-200 hover:border-[#ff6a00] text-gray-600 hover:text-[#ff6a00] py-2.5 rounded-xl text-xs font-bold transition-colors block mt-2 whitespace-normal sm:whitespace-nowrap overflow-hidden text-ellipsis"
          >
            Review Transactions Ledger
          </Link>
        </div>

      </div>

      {/* Operational Widgets: Inventory & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Inventory Health */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate pr-2">Inventory Health</h3>
            <Link to="/seller/inventory" className="text-xs font-bold text-[#ff6a00] hover:underline shrink-0">Manage Stock</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 min-w-0">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0"><FiAlertCircle className="w-5 h-5 sm:w-4 sm:h-4" /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase truncate">Out of Stock</p>
                <p className="text-lg sm:text-xl font-black text-gray-900 truncate">{outOfStockProducts.length}</p>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3 min-w-0">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0"><FiPackage className="w-5 h-5 sm:w-4 sm:h-4" /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase truncate">Low Stock (&lt;10)</p>
                <p className="text-lg sm:text-xl font-black text-gray-900 truncate">{lowStockProducts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Approval Status */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate pr-2">Product Approval Status</h3>
            <Link to="/seller/products" className="text-xs font-bold text-[#ff6a00] hover:underline shrink-0">View All</Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 sm:p-3 border border-gray-100 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                <FiClock className="text-orange-500 shrink-0" />
                <span className="text-xs font-bold text-gray-700 truncate">Pending Admin Review</span>
              </div>
              <span className="text-sm font-black text-gray-900 shrink-0 pl-2">{pendingApprovalProducts.length}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 sm:p-3 border border-gray-100 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                <FiXCircle className="text-red-500 shrink-0" />
                <span className="text-xs font-bold text-gray-700 truncate">Rejected Quality Check</span>
              </div>
              <span className="text-sm font-black text-gray-900 shrink-0 pl-2">{rejectedProducts.length}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Alert Banner */}
      {pendingOrders > 0 && (
        <div className="bg-orange-50 border border-orange-100 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="relative z-10 w-full sm:w-auto">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#ff6a00]">Action Required</h4>
            <p className="text-sm font-bold text-gray-800 mt-1 leading-snug">
              You have {pendingOrders} pending order {pendingOrders === 1 ? 'shipment' : 'shipments'} awaiting fulfillment.
            </p>
          </div>
          <Link
            to="/seller/orders"
            className="w-full sm:w-auto bg-[#ff6a00] hover:bg-[#e05e00] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm relative z-10 text-center shrink-0"
          >
            Fulfill Orders
          </Link>
          <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-orange-100 to-transparent pointer-events-none hidden sm:block"></div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
