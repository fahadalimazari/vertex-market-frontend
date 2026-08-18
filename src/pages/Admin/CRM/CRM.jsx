import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiTarget, FiPieChart, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import CRMKanbanBoard from './CRMKanbanBoard';
import CreateLeadModal from './CreateLeadModal';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`} />
    <div className="relative flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-900">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      <div className={`p-3 bg-${color}-100 rounded-xl text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

const CRM = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1'))?.token;
      const { data } = await axios.get('http://127.0.0.1:5000/api/v1/admin/crm/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data.data);
    } catch (error) {
      toast.error('Failed to load CRM stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">CRM Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">Manage leads, track deals, and convert prospects to customers.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
        >
          <FiPlus />
          Add Lead
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Leads" value={stats.totalLeads} icon={FiUsers} color="blue" />
          <StatCard title="New Leads" value={stats.newLeads} icon={FiTarget} color="purple" />
          <StatCard title="Qualified" value={stats.qualifiedLeads} icon={FiTrendingUp} color="orange" />
          <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} icon={FiPieChart} color="green" />
        </div>
      )}

      {/* Kanban Pipeline */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden h-[calc(100vh-280px)] min-h-[600px] flex flex-col">
        <CRMKanbanBoard refreshTrigger={refreshTrigger} onRefresh={handleRefresh} pipelineCounts={stats?.pipelineCounts || {}} />
      </div>

      {isCreateModalOpen && (
        <CreateLeadModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={() => {
            setIsCreateModalOpen(false);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
};

export default CRM;
