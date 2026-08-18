import { useState, useMemo } from 'react';
import { 
  AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  FiDollarSign, FiShoppingBag, FiTrendingUp, FiPackage, 
  FiRefreshCw, FiMessageCircle, FiSearch, FiServer, FiDatabase,
  FiHardDrive, FiCpu, FiStar, FiActivity
} from 'react-icons/fi';
import StatCard from '../../components/Admin/UI/StatCard';
import AdminCard from '../../components/Admin/UI/AdminCard';
import { useOrderManagement } from '../../context/Admin/OrderManagementContext';
import { useProductManagement } from '../../context/Admin/ProductManagementContext';

// --- MOCK DATA FOR CHARTS ---
const revenueData = [
  { name: 'Mon', revenue: 45000, orders: 120 },
  { name: 'Tue', revenue: 52000, orders: 135 },
  { name: 'Wed', revenue: 38000, orders: 98 },
  { name: 'Thu', revenue: 61000, orders: 160 },
  { name: 'Fri', revenue: 85000, orders: 210 },
  { name: 'Sat', revenue: 110000, orders: 280 },
  { name: 'Sun', revenue: 95000, orders: 240 },
];

const categoryData = [
  { name: 'Electronics', value: 45 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 15 },
  { name: 'Beauty', value: 15 },
];
const COLORS = ['#ff6a00', '#8b5cf6', '#10b981', '#f43f5e'];

const sparklineDataGen = () => Array.from({length: 10}, () => ({ value: Math.floor(Math.random() * 100) }));

const Analytics = () => {
  const { orders } = useOrderManagement();
  const { products } = useProductManagement();

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const aov = orders.length > 0 ? (totalRevenue / orders.length).toFixed(0) : 0;

  const sparklines = useMemo(() => ({
    revenue: sparklineDataGen(),
    orders: sparklineDataGen(),
    conversion: sparklineDataGen(),
    aov: sparklineDataGen(),
    refunds: sparklineDataGen(),
    ai: sparklineDataGen(),
  }), []);

  const kpis = [
    { title: 'Gross Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, change: '+18.2%', isPositive: true, icon: FiDollarSign, colorClass: 'text-indigo-600', bgClass: 'bg-indigo-50', sparklineData: sparklines.revenue },
    { title: 'Total Orders', value: orders.length.toLocaleString(), change: '+12.4%', isPositive: true, icon: FiShoppingBag, colorClass: 'text-orange-500', bgClass: 'bg-orange-50', sparklineData: sparklines.orders },
    { title: 'Conversion Rate', value: '3.4%', change: '+0.5%', isPositive: true, icon: FiTrendingUp, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50', sparklineData: sparklines.conversion },
    { title: 'Avg Order Value', value: `Rs. ${Number(aov).toLocaleString()}`, change: '-2.1%', isPositive: false, icon: FiPackage, colorClass: 'text-blue-600', bgClass: 'bg-blue-50', sparklineData: sparklines.aov },
    { title: 'Refund Rate', value: '1.2%', change: '-0.3%', isPositive: true, icon: FiRefreshCw, colorClass: 'text-rose-600', bgClass: 'bg-rose-50', sparklineData: sparklines.refunds },
    { title: 'AI Interactions', value: '14,205', change: '+45.8%', isPositive: true, icon: FiMessageCircle, colorClass: 'text-fuchsia-600', bgClass: 'bg-fuchsia-50', sparklineData: sparklines.ai },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Marketplace Analytics</h1>
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
            <FiActivity className="text-orange-500" />
            Comprehensive data insights across commerce, customers, and AI systems.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <button className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all shadow-sm">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-[#ff6a00] to-orange-500 hover:from-orange-600 hover:to-[#ff6a00] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-500/20">
            View Live Dashboard
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="hover:-translate-y-1 transition-transform duration-300">
            <StatCard {...kpi} />
          </div>
        ))}
      </div>

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard title="Revenue Velocity" subtitle="Daily gross sales volume" className="lg:col-span-2 shadow-sm border border-gray-100 rounded-3xl overflow-hidden min-h-[400px]">
          <div className="p-2 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6a00" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#ff6a00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', padding: '12px 20px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#111827', fontWeight: 900 }}
                  cursor={{ stroke: '#ff6a00', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue (Rs)" stroke="#ff6a00" strokeWidth={4} fillOpacity={1} fill="url(#colorRevAnalytics)" activeDot={{ r: 8, strokeWidth: 0, fill: '#ff6a00' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        
        <AdminCard title="Category Dominance" subtitle="Sales volume by top categories" className="shadow-sm border border-gray-100 rounded-3xl overflow-hidden min-h-[400px]">
          <div className="p-2 h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#111827' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '13px', fontWeight: '700', paddingTop: '20px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      {/* Analytics Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Product Analytics */}
        <AdminCard title="Product Performance" subtitle="Top performing inventory" className="shadow-sm border border-gray-100 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-100">
                  <th className="pb-4 font-black">Product</th>
                  <th className="pb-4 font-black text-right">Velocity</th>
                  <th className="pb-4 font-black text-right">Revenue</th>
                  <th className="pb-4 font-black text-center">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id} className="group hover:bg-gray-50/80 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                          <img src={p.images?.[0] || 'https://via.placeholder.com/150'} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="font-bold text-gray-900 truncate max-w-[180px] group-hover:text-orange-500 transition-colors">{p.name}</p>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-lg">
                        <FiTrendingUp className="text-green-500 text-[10px]" />
                        <span className="font-bold text-gray-700">{(Math.random() * 500).toFixed(0)}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-black text-gray-900">Rs. {(p.price * 10).toLocaleString()}</td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-green-50/50 text-green-600 border border-green-200/50 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        In Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        {/* AI Usage Analytics */}
        <AdminCard title="Vertex AI Intelligence" subtitle="Marketplace cognitive metrics" className="shadow-sm border border-gray-100 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-purple-50/30">
          <div className="grid grid-cols-2 gap-4 mb-8 mt-2">
            <div className="bg-white p-5 rounded-2xl border border-purple-100/50 shadow-sm shadow-purple-100 flex flex-col justify-between group hover:border-purple-300 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FiSearch size={20} />
                </div>
                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md">+12.4%</span>
              </div>
              <div>
                <h4 className="text-3xl font-black text-gray-900 tracking-tight">4,290</h4>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Voice Searches</p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-indigo-100/50 shadow-sm shadow-indigo-100 flex flex-col justify-between group hover:border-indigo-300 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FiStar size={20} />
                </div>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">+28.1%</span>
              </div>
              <div>
                <h4 className="text-3xl font-black text-gray-900 tracking-tight">12,450</h4>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Smart Recs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Unresolved Intents</h4>
              <button className="text-[10px] font-bold text-orange-500 hover:text-orange-600 uppercase">View All</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['PS5 Pro', 'RTX 5090', 'iPhone 16 Fold', 'Flying Car', 'Neuralink', 'Cybercab'].map((term, i) => (
                <span key={i} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-colors cursor-pointer">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      {/* System Health */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Core Infrastructure</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-5 rounded-3xl border border-gray-800 shadow-lg group hover:border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-gray-800/80 rounded-2xl text-green-400 group-hover:bg-green-500/10 transition-colors"><FiServer size={22} /></div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight">99.99<span className="text-sm text-green-400">%</span></h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Uptime SLA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-5 rounded-3xl border border-gray-800 shadow-lg group hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-gray-800/80 rounded-2xl text-blue-400 group-hover:bg-blue-500/10 transition-colors"><FiDatabase size={22} /></div>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight">Optimized</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Database Cluster</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-5 rounded-3xl border border-gray-800 shadow-lg group hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-gray-800/80 rounded-2xl text-orange-400 group-hover:bg-orange-500/10 transition-colors"><FiCpu size={22} /></div>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight">42<span className="text-sm text-orange-400">ms</span></h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Global API Latency</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-5 rounded-3xl border border-gray-800 shadow-lg group hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-gray-800/80 rounded-2xl text-purple-400 group-hover:bg-purple-500/10 transition-colors"><FiHardDrive size={22} /></div>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight">14.2<span className="text-sm text-purple-400">TB</span></h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">S3 Bucket Usage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
