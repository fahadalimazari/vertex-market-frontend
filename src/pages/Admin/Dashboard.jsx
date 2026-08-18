import { useState, useMemo } from 'react';
import { useUserManagement } from '../../context/Admin/UserManagementContext';
import { useSellerManagement } from '../../context/Admin/SellerManagementContext';
import { useProductManagement } from '../../context/Admin/ProductManagementContext';
import { useOrderManagement } from '../../context/Admin/OrderManagementContext';
import { useLogs } from '../../context/Admin/LogsContext';
import { 
  FiUsers, FiShoppingBag, FiPackage, FiTrendingUp, 
  FiPlus, FiChevronRight, FiBox, FiTag, FiFileText, FiMessageCircle, FiCheckCircle 
} from 'react-icons/fi';
import { MdOutlineRocketLaunch } from 'react-icons/md';
import { Link } from 'react-router-dom';
import StatCard from '../../components/Admin/UI/StatCard';
import AdminCard from '../../components/Admin/UI/AdminCard';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// --- Mock Data for Charts ---
const salesData = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 5000, orders: 35 },
  { name: 'Thu', revenue: 2780, orders: 15 },
  { name: 'Fri', revenue: 6890, orders: 48 },
  { name: 'Sat', revenue: 8390, orders: 60 },
  { name: 'Sun', revenue: 7490, orders: 52 },
];

const sparklineDataGen = () => Array.from({length: 10}, () => ({ value: Math.floor(Math.random() * 100) }));

const Dashboard = () => {
  const { users } = useUserManagement();
  const { sellers, approveSeller } = useSellerManagement();
  const { products } = useProductManagement();
  const { orders } = useOrderManagement();
  const { logs } = useLogs();

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingSellers = sellers.filter(s => s.status.includes('Pending'));

  // Memoize sparklines so they don't jump around on re-renders
  const sparklines = useMemo(() => ({
    revenue: sparklineDataGen(),
    orders: sparklineDataGen(),
    customers: sparklineDataGen(),
    products: sparklineDataGen()
  }), []);

  const kpis = [
    { title: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, change: '+14.5%', isPositive: true, icon: FiTrendingUp, colorClass: 'text-indigo-600', bgClass: 'bg-indigo-50', sparklineData: sparklines.revenue },
    { title: 'Total Orders', value: orders.length.toLocaleString(), change: '+8.2%', isPositive: true, icon: FiPackage, colorClass: 'text-[#ff6a00]', bgClass: 'bg-orange-50', sparklineData: sparklines.orders },
    { title: 'Total Customers', value: users.length.toLocaleString(), change: '-2.4%', isPositive: false, icon: FiUsers, colorClass: 'text-blue-600', bgClass: 'bg-blue-50', sparklineData: sparklines.customers },
    { title: 'Active Listings', value: products.length.toLocaleString(), change: '+24%', isPositive: true, icon: FiShoppingBag, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50', sparklineData: sparklines.products },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Enterprise Overview</h1>
          <p className="text-xs text-gray-500 mt-1">Monitor your marketplace performance and growth.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
            <FiPlus /> Quick Actions
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => <StatCard key={idx} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Chart (Left 2 columns) */}
        <div className="lg:col-span-2">
          <AdminCard 
            title="Sales Analytics" 
            subtitle="Revenue vs Orders over the last 7 days"
            action={<select className="text-xs border-gray-200 rounded-lg shadow-sm"><option>Last 7 Days</option><option>Last 30 Days</option></select>}
            className="h-full min-h-[400px]"
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6a00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff6a00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', marginTop: '10px' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue (Rs)" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="orders" name="Total Orders" stroke="#ff6a00" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </AdminCard>
        </div>

        {/* Quick Action Shortcuts (Right 1 column) */}
        <div className="space-y-4">
          <AdminCard title="Quick Actions" subtitle="Frequently used modules">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Add Product', icon: FiBox, color: 'text-indigo-600', bg: 'bg-indigo-50', to: '/admin/products' },
                { label: 'Create Coupon', icon: FiTag, color: 'text-emerald-600', bg: 'bg-emerald-50', to: '/admin/coupons' },
                { label: 'Flash Sale', icon: MdOutlineRocketLaunch, color: 'text-orange-500', bg: 'bg-orange-50', to: '/admin/cms' },
                { label: 'AI Manager', icon: FiMessageCircle, color: 'text-purple-600', bg: 'bg-purple-50', to: '/admin/ai-insights' },
              ].map((action, i) => (
                <Link key={i} to={action.to} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                  <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </AdminCard>
          
          {/* Low Stock Widget */}
          <AdminCard className="flex-1 bg-gradient-to-br from-red-50 to-orange-50 border-red-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <FiPackage size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Low Stock Alert</h3>
                <p className="text-xs text-gray-600">12 products are running low</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-xs font-bold transition-colors">
              Manage Inventory
            </button>
          </AdminCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expanded Activity Feed */}
        <AdminCard 
          title="Live Activity Feed" 
          subtitle="Real-time system events"
          action={<Link to="/admin/logs" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>}
        >
          <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[17px] before:w-[2px] before:bg-gray-100">
            {logs.slice(0, 5).map((log, i) => (
              <div key={log.id} className="relative flex gap-4 pl-1">
                {/* Timeline dot */}
                <div className="w-8 h-8 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center shrink-0 z-10">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                </div>
                <div className="pt-1.5 flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[13px] font-bold text-gray-900 truncate">{log.action}</p>
                    <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">
                      {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Pending Sellers */}
        <AdminCard 
          title="Pending Seller Requests" 
          subtitle={`${pendingSellers.length} stores waiting for approval`}
          action={<Link to="/admin/sellers" className="text-xs font-bold text-orange-600 hover:underline">Manage</Link>}
        >
          {pendingSellers.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {pendingSellers.map(seller => (
                <div key={seller.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                      {seller.storeName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-950 text-sm truncate">{seller.storeName}</p>
                      <p className="text-xs text-gray-500 truncate">{seller.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => approveSeller(seller.id)}
                    className="bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <FiCheckCircle className="text-green-500 text-2xl" />
              </div>
              <p className="text-sm font-bold text-gray-900">All Caught Up!</p>
              <p className="text-xs text-gray-500 mt-1">No pending seller registrations.</p>
            </div>
          )}
        </AdminCard>
      </div>

    </div>
  );
};

export default Dashboard;
