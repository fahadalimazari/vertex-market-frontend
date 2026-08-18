import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSellerManagement } from '../../context/Admin/SellerManagementContext';
import { useLogs } from '../../context/Admin/LogsContext';
import { 
  FiSearch, FiCheck, FiX, FiEye, FiShield, 
  FiAward, FiAlertCircle, FiBriefcase,
  FiShoppingBag, FiUsers, FiStar, FiDollarSign, FiChevronLeft, FiChevronRight, FiMessageSquare
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import BadgeRenderer from '../../components/Admin/BadgeRenderer';

const PREDEFINED_BADGES = [
  { label: 'Featured Seller', icon: 'FaStar', description: 'Featured marketplace seller' },
  { label: 'Official Partner', icon: 'FaHandshake', description: 'Verified official partner' },
  { label: 'Premium Seller', icon: 'FaCrown', description: 'Premium subscription seller' },
  { label: 'Trusted Business', icon: 'FaShieldAlt', description: 'Highly trusted corporate business' },
  { label: 'Special Seller', icon: 'FaAward', description: 'Special recognized seller' },
];

const Sellers = () => {
  const { sellers, stats, approveSeller, rejectSeller, suspendSeller } = useSellerManagement();
  const { addLog } = useLogs();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState(null); // Full Store Details
  const [rejectModalId, setRejectModalId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Documents insufficient or incomplete.');
  const [activeTab, setActiveTab] = useState('info'); // info, products, followers, orders, reviews, badges

  // Badge Management State
  const [assignBadgeModalId, setAssignBadgeModalId] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(PREDEFINED_BADGES[0]);
  const [badgeActionLoading, setBadgeActionLoading] = useState(false);

  // Tab Data State
  const [tabData, setTabData] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Workflow Handlers
  const handleApprove = (id, name) => {
    approveSeller(id);
    addLog('Store Approved', `Approved store "${name}"`);
    toast.success(`${name} has been officially approved!`);
    if (selectedSeller && selectedSeller.id === id) {
      setSelectedSeller(prev => ({ ...prev, status: 'Approved' }));
    }
  };

  const handleReject = (id, name) => {
    rejectSeller(id, rejectionReason);
    addLog('Store Rejected', `Rejected store "${name}": ${rejectionReason}`);
    toast.error(`${name} has been rejected.`);
    setRejectModalId(null);
    if (selectedSeller && selectedSeller.id === id) {
      setSelectedSeller(prev => ({ ...prev, status: 'Rejected' }));
    }
  };

  const handleSuspend = (id, name) => {
    if(window.confirm('Are you sure you want to suspend this store?')) {
      suspendSeller(id);
      addLog('Store Suspended', `Suspended store "${name}"`);
      toast.error(`Suspended store ${name}.`);
    }
  };

  const fetchStoreDetails = useCallback(async (storeId) => {
    try {
      const dataStr = localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1');
      const token = dataStr ? JSON.parse(dataStr).token : '';
      const res = await fetch(`http://localhost:5000/api/v1/superadmin/sellers/${storeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSeller(prev => ({ ...prev, badges: data.data.badges, badgeHistory: data.data.badgeHistory }));
      }
    } catch(err) {
      console.error('Error refreshing store details', err);
    }
  }, []);

  const handleAssignBadge = async () => {
    if (!assignBadgeModalId) return;
    setBadgeActionLoading(true);
    try {
      const dataStr = localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1');
      const token = dataStr ? JSON.parse(dataStr).token : '';
      const res = await fetch(`http://localhost:5000/api/v1/superadmin/sellers/${assignBadgeModalId}/badges`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: selectedBadge.label, icon: selectedBadge.icon, reason: selectedBadge.description })
      });
      const data = await res.json();
      if (data.success) {
         toast.success('Badge assigned successfully');
         addLog('Badge Assigned', `Assigned ${selectedBadge.label} badge`);
         setAssignBadgeModalId(null);
         fetchStoreDetails(assignBadgeModalId); // Refresh modal data
      } else {
         toast.error(data.message || 'Failed to assign badge');
      }
    } catch(err) {
      toast.error('Error assigning badge');
    } finally {
      setBadgeActionLoading(false);
    }
  };

  const handleRemoveBadge = async (storeId, badgeId) => {
    if(!window.confirm('Remove this badge? It will remain in history.')) return;
    try {
      const dataStr = localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1');
      const token = dataStr ? JSON.parse(dataStr).token : '';
      const res = await fetch(`http://localhost:5000/api/v1/superadmin/sellers/${storeId}/badges/${badgeId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
         toast.success('Badge removed');
         fetchStoreDetails(storeId);
      } else {
         toast.error('Failed to remove badge');
      }
    } catch(err) {
      toast.error('Error removing badge');
    }
  };

  // Fetch Data for Tabs
  const fetchTabData = useCallback(async (storeId, tab, currentPage) => {
    if (tab === 'info' || tab === 'badges') return;
    setTabLoading(true);
    try {
      const dataStr = localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1');
      const token = dataStr ? JSON.parse(dataStr).token : '';
      
      const res = await fetch(`http://localhost:5000/api/v1/superadmin/sellers/${storeId}/${tab}?page=${currentPage}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setTabData(data.data);
        setTotalPages(Math.ceil((data.pagination?.total || 1) / limit));
      } else {
        toast.error(`Failed to load ${tab}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error loading ${tab}`);
    } finally {
      setTabLoading(false);
    }
  }, []);

  // Trigger fetch when tab or page changes
  useEffect(() => {
    if (selectedSeller && activeTab !== 'info' && activeTab !== 'badges') {
      fetchTabData(selectedSeller.id, activeTab, page);
    } else if (selectedSeller && (activeTab === 'info' || activeTab === 'badges')) {
      // Refresh info to get latest badges history just in case
      if(!selectedSeller.badgeHistory) {
         fetchStoreDetails(selectedSeller.id);
      }
    }
  }, [selectedSeller?.id, activeTab, page, fetchTabData, fetchStoreDetails]);

  // Handle Tab Switch
  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
    setTabData([]);
  };

  // Filtered sellers list
  const filteredSellers = useMemo(() => {
    return (sellers || []).filter(s => {
      const matchesSearch = 
        (s.storeName && s.storeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.owner && s.owner.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.storeSlug && s.storeSlug.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      if (statusFilter !== 'all' && s.status !== statusFilter) return false;

      return true;
    });
  }, [sellers, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiShield className="text-[#ff6a00]" /> Super Admin Store Management
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Complete overview and real-time statistics of all stores in the database.
        </p>
      </div>

      {/* Real-Time Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Stores</span>
          <span className="text-2xl font-black text-gray-900 mt-1">{stats.total || 0}</span>
        </div>
        <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest block">Approved</span>
          <span className="text-2xl font-black text-green-700 mt-1">{stats.approved || 0}</span>
        </div>
        <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">Pending</span>
          <span className="text-2xl font-black text-orange-600 mt-1">{stats.pending || 0}</span>
        </div>
        <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block">Rejected</span>
          <span className="text-2xl font-black text-red-700 mt-1">{stats.rejected || 0}</span>
        </div>
        <div className="bg-yellow-50/50 p-4 rounded-2xl border border-yellow-100 shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest block">Suspended</span>
          <span className="text-2xl font-black text-yellow-700 mt-1">{stats.suspended || 0}</span>
        </div>
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Inactive</span>
          <span className="text-2xl font-black text-gray-600 mt-1">{stats.inactive || 0}</span>
        </div>
      </div>

      {/* Advanced search & filters block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
        <div className="sm:col-span-2 relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs w-full font-medium bg-gray-50/50"
            placeholder="Search stores by name, slug, owner, email..."
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6a00] outline-none text-xs bg-gray-50/50 text-gray-700 font-bold"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Resubmission Required">Resubmission Required</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Complete Store List */}
      <div className="bg-transparent md:bg-white md:border md:border-gray-100 rounded-2xl md:shadow-sm">
        {filteredSellers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-medium bg-white rounded-2xl shadow-sm">
            No stores found in the database matching your criteria.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max lg:min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">Store</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4 text-center">Products</th>
                    <th className="p-4 text-center">Followers</th>
                    <th className="p-4 text-center">Rating</th>
                    <th className="p-4 text-center">Orders</th>
                    <th className="p-4 text-right">Revenue</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                  {filteredSellers.map((seller) => {
                    const dpImg = seller.storeLogo || seller.ownerAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.storeName) + '&background=random';
                    const ownerImg = seller.ownerAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.owner) + '&background=random';

                    return (
                      <tr key={seller.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6 flex items-center gap-3">
                          <img src={dpImg} alt={seller.storeName} className="w-9 h-9 rounded-xl object-cover bg-gray-100 border border-gray-200" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.storeName) }} />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{seller.storeName}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">@{seller.storeSlug}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img src={ownerImg} alt={seller.owner} className="w-6 h-6 rounded-full object-cover bg-gray-100" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.owner) }} />
                            <div>
                              <p className="font-bold text-gray-800">{seller.owner}</p>
                              <p className="text-[10px] text-gray-500">{seller.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center font-bold text-gray-900">{seller.productsCount}</td>
                        <td className="p-4 text-center font-bold text-gray-900">{seller.followersCount?.toLocaleString() || 0}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md">
                            {seller.rating ? seller.rating.toFixed(1) : '0.0'} <FiStar className="fill-current text-[10px]" />
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-gray-900">{seller.ordersCount || 0}</td>
                        <td className="p-4 text-right font-black text-green-700">Rs. {seller.earnings?.toLocaleString() || 0}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wide border ${
                            seller.status === 'Approved' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : seller.status === 'Pending' || seller.status === 'Pending Review'
                                ? 'bg-orange-50 text-orange-600 border-orange-200 animate-pulse'
                                : seller.status === 'Suspended'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {seller.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 w-32">
                            {seller.badges && seller.badges.slice(0, 3).map((badge, idx) => (
                              <span key={badge._id || idx} className={`px-1.5 py-0.5 text-white text-[9px] font-bold rounded flex items-center gap-1 shadow-sm ${badge.source === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`}>
                                <BadgeRenderer icon={badge.icon || badge} /> {badge.label || badge}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedSeller(seller);
                                handleTabSwitch('info');
                              }}
                              className="px-3 py-1.5 bg-gray-900 hover:bg-[#ff6a00] text-white rounded-lg text-[10px] font-bold transition-colors shadow-sm inline-flex items-center gap-1"
                            >
                              <FiEye /> View Store
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredSellers.map((seller) => {
                const dpImg = seller.storeLogo || seller.ownerAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.storeName) + '&background=random';
                const ownerImg = seller.ownerAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.owner) + '&background=random';

                return (
                  <div key={seller.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                    {/* Header: Store Info & Status */}
                    <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <img src={dpImg} alt={seller.storeName} className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.storeName) }} />
                        <div>
                          <p className="font-bold text-gray-900 text-base">{seller.storeName}</p>
                          <p className="text-xs text-gray-400">@{seller.storeSlug}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wide border ${
                        seller.status === 'Approved' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : seller.status === 'Pending' || seller.status === 'Pending Review'
                            ? 'bg-orange-50 text-orange-600 border-orange-200 animate-pulse'
                            : seller.status === 'Suspended'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {seller.status}
                      </span>
                    </div>

                    {/* Owner Info */}
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <img src={ownerImg} alt={seller.owner} className="w-8 h-8 rounded-full object-cover bg-white border border-gray-200" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.owner) }} />
                      <div>
                        <p className="font-bold text-gray-800 text-xs">{seller.owner}</p>
                        <p className="text-[10px] text-gray-500">{seller.email}</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                         <span className="block text-[10px] font-bold text-gray-400 uppercase">Products</span>
                         <span className="block font-black text-gray-900">{seller.productsCount}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                         <span className="block text-[10px] font-bold text-gray-400 uppercase">Followers</span>
                         <span className="block font-black text-gray-900">{seller.followersCount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded-lg text-center">
                         <span className="block text-[10px] font-bold text-yellow-600 uppercase">Rating</span>
                         <span className="block font-black text-yellow-700 flex items-center justify-center gap-1">
                           {seller.rating ? seller.rating.toFixed(1) : '0.0'} <FiStar className="fill-current text-[10px]" />
                         </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-green-50 p-2.5 rounded-xl border border-green-100">
                       <span className="text-[10px] font-bold text-green-700 uppercase">Revenue</span>
                       <span className="font-black text-green-700">Rs. {seller.earnings?.toLocaleString() || 0}</span>
                    </div>

                    {/* Badges */}
                    {seller.badges && seller.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {seller.badges.slice(0, 3).map((badge, idx) => (
                          <span key={badge._id || idx} className={`px-2 py-1 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-sm ${badge.source === 'admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`}>
                            <BadgeRenderer icon={badge.icon || badge} /> {badge.label || badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        setSelectedSeller(seller);
                        handleTabSwitch('info');
                      }}
                      className="w-full py-2.5 bg-gray-900 hover:bg-[#ff6a00] text-white rounded-xl text-xs font-bold transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 mt-2"
                    >
                      <FiEye className="text-sm" /> View Store Details
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* STORE DETAILS INSPECTION MODAL */}
      <AnimatePresence>
        {selectedSeller && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setSelectedSeller(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-gray-50 rounded-3xl border border-gray-100 shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                    <img 
                      src={selectedSeller.storeLogo || selectedSeller.ownerAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedSeller.storeName)} 
                      alt="Logo" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedSeller.storeName) }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ff6a00] block">Store Profile Ecosystem</span>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                      {selectedSeller.storeName}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase border ${
                        selectedSeller.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {selectedSeller.status}
                      </span>
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-white shrink-0 px-6 overflow-x-auto hide-scrollbar">
                {[
                  { id: 'info', label: 'Overview', icon: FiBriefcase },
                  { id: 'badges', label: 'Badges', icon: FiAward },
                  { id: 'products', label: 'Products', icon: FiShoppingBag },
                  { id: 'followers', label: 'Followers', icon: FiUsers },
                  { id: 'orders', label: 'Orders', icon: FiDollarSign },
                  { id: 'reviews', label: 'Reviews', icon: FiMessageSquare }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSwitch(tab.id)}
                    className={`px-4 py-3 flex items-center gap-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id ? 'border-[#ff6a00] text-[#ff6a00]' : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="text-sm" /> {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    {/* Performance Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <FiUsers className="text-xl text-blue-500 mb-2" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Followers</span>
                        <span className="text-xl font-black text-gray-900">{selectedSeller.followersCount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <FiShoppingBag className="text-xl text-purple-500 mb-2" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Products</span>
                        <span className="text-xl font-black text-gray-900">{selectedSeller.productsCount}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <FiStar className="text-xl text-yellow-400 mb-2 fill-current" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Rating</span>
                        <span className="text-xl font-black text-gray-900">{selectedSeller.rating ? selectedSeller.rating.toFixed(1) : '0.0'}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <FiDollarSign className="text-xl text-green-500 mb-2" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Total Revenue</span>
                        <span className="text-xl font-black text-gray-900">Rs. {selectedSeller.earnings?.toLocaleString() || 0}</span>
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h4 className="text-xs font-black uppercase text-gray-900 border-b pb-2">Business Details</h4>
                        <div className="space-y-2 text-xs">
                          <p className="flex justify-between"><span className="text-gray-500">Slug:</span> <strong className="text-gray-900">@{selectedSeller.storeSlug}</strong></p>
                          <p className="flex justify-between"><span className="text-gray-500">Category:</span> <strong className="text-gray-900">{selectedSeller.businessCategory}</strong></p>
                          <p className="flex justify-between"><span className="text-gray-500">Created:</span> <strong className="text-gray-900">{new Date(selectedSeller.createdAt).toLocaleString()}</strong></p>
                          <p className="flex justify-between"><span className="text-gray-500">CNIC:</span> <strong className="text-gray-900 font-mono">{selectedSeller.nationalId}</strong></p>
                          <p className="flex justify-between"><span className="text-gray-500">NTN:</span> <strong className="text-gray-900 font-mono">{selectedSeller.ntn}</strong></p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h4 className="text-xs font-black uppercase text-gray-900 border-b pb-2">Owner Profile</h4>
                        <div className="flex items-center gap-4 mb-2">
                           <img 
                             src={selectedSeller.ownerAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedSeller.owner)} 
                             alt={selectedSeller.owner}
                             className="w-12 h-12 rounded-full bg-gray-100 object-cover border border-gray-200"
                           />
                           <div>
                             <p className="font-bold text-gray-900">{selectedSeller.owner}</p>
                             <p className="text-[10px] text-[#ff6a00] font-bold">Seller | Verified</p>
                           </div>
                        </div>
                        <div className="space-y-2 text-xs">
                          <p className="flex justify-between"><span className="text-gray-500">Email:</span> <strong className="text-gray-900">{selectedSeller.email}</strong></p>
                          <p className="flex justify-between"><span className="text-gray-500">Phone:</span> <strong className="text-gray-900">{selectedSeller.phone}</strong></p>
                          <p className="flex justify-between"><span className="text-gray-500">Address:</span> <strong className="text-gray-900 text-right w-2/3 truncate" title={selectedSeller.address}>{selectedSeller.address}</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* --- BADGES TAB --- */}
                {activeTab === 'badges' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div>
                        <h3 className="font-black text-gray-900 text-sm">Badge Management</h3>
                        <p className="text-xs text-gray-500">View and manage the badges assigned to this store.</p>
                      </div>
                      <button 
                        onClick={() => setAssignBadgeModalId(selectedSeller.id)}
                        className="px-4 py-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        + Assign Badge
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Active Badges */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Active Badges</h4>
                        {selectedSeller.badges && selectedSeller.badges.length > 0 ? (
                          selectedSeller.badges.map((badge, idx) => (
                            <div key={badge._id || idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                              <div className={`absolute top-0 left-0 w-1 h-full ${badge.source === 'admin' ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                              <div className="flex items-start justify-between ml-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${badge.source === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 'bg-gradient-to-br from-orange-500 to-amber-500'}`}>
                                    <BadgeRenderer icon={badge.icon || badge} className="text-lg" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-sm">{badge.label || badge}</h5>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{badge.source === 'admin' ? 'Admin Assigned' : 'Automatically Earned'}</span>
                                  </div>
                                </div>
                                {badge.source === 'admin' && (
                                  <button onClick={() => handleRemoveBadge(selectedSeller.id, badge._id)} className="text-[10px] text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded">
                                    Remove
                                  </button>
                                )}
                              </div>
                              {badge.reason && <p className="text-xs text-gray-500 ml-2 mt-1 italic">"{badge.reason}"</p>}
                              {badge.assignedAt && <p className="text-[10px] text-gray-400 ml-2">Assigned on: {new Date(badge.assignedAt).toLocaleDateString()}</p>}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-500 p-4 border border-dashed rounded-xl border-gray-200">No active badges.</div>
                        )}
                      </div>

                      {/* Badge History (Inactive) */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Badge History (Removed)</h4>
                        {selectedSeller.badgeHistory && selectedSeller.badgeHistory.filter(b => !b.isActive).length > 0 ? (
                          selectedSeller.badgeHistory.filter(b => !b.isActive).map((badge, idx) => (
                            <div key={badge._id || idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-200 text-gray-500">
                                    <BadgeRenderer icon={badge.icon} className="text-lg" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-700 text-sm line-through">{badge.label}</h5>
                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Removed</span>
                                  </div>
                                </div>
                              </div>
                              {badge.reason && <p className="text-xs text-gray-500 mt-1 italic">"{badge.reason}"</p>}
                              {badge.assignedAt && <p className="text-[10px] text-gray-400">Originally assigned: {new Date(badge.assignedAt).toLocaleDateString()}</p>}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-400 p-4 border border-dashed rounded-xl border-gray-100">No removed badges in history.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* --- PRODUCTS TAB --- */}
                {activeTab === 'products' && (
                  <div className="space-y-4">
                    {tabLoading ? (
                      <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div></div>
                    ) : tabData.length === 0 ? (
                      <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                         <FiShoppingBag className="mx-auto text-4xl text-gray-300 mb-3" />
                         <p className="text-sm font-bold text-gray-500">No active products found for this store.</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Product</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">SKU</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Price</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase text-center">Stock</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase text-center">Rating</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs">
                            {tabData.map(product => (
                              <tr key={product._id} className="hover:bg-gray-50">
                                <td className="p-3 flex items-center gap-3">
                                  <img src={product.image || 'https://via.placeholder.com/40'} alt="product" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                  <span className="font-bold text-gray-900 line-clamp-1">{product.name}</span>
                                </td>
                                <td className="p-3 text-gray-500">{product.sku}</td>
                                <td className="p-3 font-bold">Rs. {product.price?.toLocaleString()}</td>
                                <td className="p-3 text-center font-bold text-gray-900">{product.stock}</td>
                                <td className="p-3 text-center">
                                  <span className="inline-flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-1.5 py-0.5 rounded">
                                    {product.rating ? product.rating.toFixed(1) : '0.0'} <FiStar className="fill-current text-[10px]" />
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${product.status === 'Active' || product.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {product.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                {/* --- FOLLOWERS TAB --- */}
                {activeTab === 'followers' && (
                  <div className="space-y-4">
                    {tabLoading ? (
                      <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div></div>
                    ) : tabData.length === 0 ? (
                      <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                         <FiUsers className="mx-auto text-4xl text-gray-300 mb-3" />
                         <p className="text-sm font-bold text-gray-500">Store has no followers yet.</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase pl-6">User</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Email</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Followed Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs">
                            {tabData.map(follower => {
                              const user = follower.userId || {};
                              return (
                                <tr key={follower._id} className="hover:bg-gray-50">
                                  <td className="p-3 pl-6 flex items-center gap-3">
                                    <img src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User')} alt="user" className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                                    <span className="font-bold text-gray-900">{user.name || 'Unknown User'}</span>
                                  </td>
                                  <td className="p-3 text-gray-500">{user.email || 'N/A'}</td>
                                  <td className="p-3 text-gray-500">{new Date(follower.createdAt).toLocaleDateString()}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                {/* --- ORDERS TAB --- */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {tabLoading ? (
                      <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div></div>
                    ) : tabData.length === 0 ? (
                      <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                         <FiDollarSign className="mx-auto text-4xl text-gray-300 mb-3" />
                         <p className="text-sm font-bold text-gray-500">No orders found for this store.</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase pl-6">Order ID</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Customer</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Amount</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs">
                            {tabData.map(order => (
                              <tr key={order._id} className="hover:bg-gray-50">
                                <td className="p-3 pl-6 font-mono font-bold text-[#ff6a00]">#{order.orderNumber}</td>
                                <td className="p-3 font-bold text-gray-900">{order.user?.name || 'Guest'}</td>
                                <td className="p-3 font-bold">Rs. {order.totalPrice?.toLocaleString()}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                {/* --- REVIEWS TAB --- */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {tabLoading ? (
                      <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div></div>
                    ) : tabData.length === 0 ? (
                      <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                         <FiMessageSquare className="mx-auto text-4xl text-gray-300 mb-3" />
                         <p className="text-sm font-bold text-gray-500">No reviews have been written for this store's products.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tabData.map(review => {
                          const customer = review.userId || {};
                          const product = review.productId || {};
                          return (
                            <div key={review._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img src={customer.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(customer.name || 'Customer')} alt="customer" className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                                  <div>
                                    <span className="font-bold text-gray-900 text-xs">{customer.name || 'Customer'}</span>
                                    <div className="flex text-yellow-400 text-[10px]">
                                      {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-200'} />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-gray-700 italic">"{review.description}"</p>
                              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-2">
                                <img src={product.image || 'https://via.placeholder.com/20'} alt="product" className="w-6 h-6 rounded bg-gray-100 object-cover" />
                                <span className="text-[10px] font-bold text-gray-500 truncate">{product.name || 'Deleted Product'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tab Pagination Controls */}
                {activeTab !== 'info' && activeTab !== 'badges' && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs text-gray-500 font-medium">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || tabLoading}
                        className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <FiChevronLeft className="text-gray-700" />
                      </button>
                      <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || tabLoading}
                        className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <FiChevronRight className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              <div className="bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-gray-500">Current DB Status: <strong className={`uppercase ${selectedSeller.status === 'Approved' ? 'text-green-600' : 'text-orange-600'}`}>{selectedSeller.status}</strong></span>
                <div className="flex gap-3">
                  {(selectedSeller.status === 'Approved' || selectedSeller.status === 'Pending') && (
                    <button
                      onClick={() => handleSuspend(selectedSeller.id, selectedSeller.storeName)}
                      className="px-5 py-2.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold rounded-xl text-xs transition-colors"
                    >
                      Suspend Store
                    </button>
                  )}
                  {(selectedSeller.status === 'Pending' || selectedSeller.status === 'Resubmission Required') && (
                    <button
                      onClick={() => setRejectModalId(selectedSeller.id)}
                      className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  {selectedSeller.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(selectedSeller.id, selectedSeller.storeName)}
                      className="px-6 py-2.5 bg-[#ff6a00] hover:bg-[#e65f00] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 text-xs transition-all flex items-center gap-1.5"
                    >
                      <FiCheck className="text-sm" /> Approve & Activate
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGN BADGE MODAL */}
      <AnimatePresence>
        {assignBadgeModalId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <FiAward className="text-[#ff6a00]" /> Assign Store Badge
                </h3>
                <button onClick={() => setAssignBadgeModalId(null)} className="text-gray-400 hover:text-gray-700"><FiX className="text-xl" /></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Badge Type</label>
                  <select 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#ff6a00] transition-shadow font-bold text-gray-800"
                    onChange={(e) => setSelectedBadge(PREDEFINED_BADGES.find(b => b.label === e.target.value))}
                    value={selectedBadge.label}
                  >
                    {PREDEFINED_BADGES.map(badge => (
                      <option key={badge.label} value={badge.label}>{badge.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-sm">
                     <BadgeRenderer icon={selectedBadge.icon} />
                   </div>
                   <div>
                     <p className="font-bold text-purple-900">{selectedBadge.label}</p>
                     <p className="text-[10px] text-purple-600">Icon: {selectedBadge.icon}</p>
                   </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Reason / Description</label>
                  <textarea
                    readOnly
                    value={selectedBadge.description}
                    rows={2}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setAssignBadgeModalId(null)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 transition-colors">Cancel</button>
                <button 
                  onClick={handleAssignBadge}
                  disabled={badgeActionLoading}
                  className="px-6 py-2.5 bg-[#ff6a00] hover:bg-[#e65f00] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  {badgeActionLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <FiCheck />}
                  Assign Badge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REJECTION REASON MODAL */}
      <AnimatePresence>
        {rejectModalId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <FiAlertCircle className="text-red-500 text-xl" /> Reject Store Application
              </h3>
              <p className="text-xs text-gray-500">Provide the rejection reason. This will be stored in the database.</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full p-3.5 border border-gray-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setRejectModalId(null)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs">Cancel</button>
                <button 
                  onClick={() => {
                    const storeName = sellers.find(s => s.id === rejectModalId)?.storeName || 'Merchant';
                    handleReject(rejectModalId, storeName);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-500/20"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Sellers;
