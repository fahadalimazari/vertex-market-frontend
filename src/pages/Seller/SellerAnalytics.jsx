import { useState, useEffect } from 'react';
import { sellerService } from '../../services/seller/sellerService';
import { FiPieChart, FiTrendingUp, FiShoppingBag, FiUsers, FiBox } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';

const SellerAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await sellerService.getAnalytics();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <FiLoader className="h-8 w-8 animate-spin text-[#ff6a00]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiPieChart className="text-[#ff6a00]" /> Analytics & Revenue
          </h1>
          <p className="text-sm text-gray-500 mt-1">Detailed breakdown of your store's performance.</p>
        </div>
        <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold bg-white outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <FiTrendingUp size={20} />
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Gross Revenue</h3>
          </div>
          <p className="text-2xl font-black text-gray-900">Rs. {(stats?.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <FiShoppingBag size={20} />
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Total Orders</h3>
          </div>
          <p className="text-2xl font-black text-gray-900">{stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-green-600">
            <FiBox size={20} />
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Active Products</h3>
          </div>
          <p className="text-2xl font-black text-gray-900">{stats?.activeProducts || 0} / {stats?.totalProducts || 0}</p>
        </div>
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-purple-600">
            <FiPieChart size={20} />
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Completed Orders</h3>
          </div>
          <p className="text-2xl font-black text-gray-900">{stats?.completedOrders || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-black text-gray-900 mb-6">Revenue Trend</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.salesData || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6a00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff6a00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Area type="monotone" dataKey="sales" stroke="#ff6a00" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
