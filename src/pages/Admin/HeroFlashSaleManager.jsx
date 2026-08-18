import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheckCircle,
  FiXCircle, FiCalendar, FiTag, FiShoppingBag, FiDollarSign,
  FiEye, FiMousePointer, FiTrendingUp, FiCheck, FiFilter
} from 'react-icons/fi';

const HeroFlashSaleManager = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Product Selection State
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductSelector, setShowProductSelector] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    saleName: '',
    productId: '',
    badge: 'Flash Sale',
    salePrice: 0,
    originalPrice: 0,
    discountType: 'Percentage',
    discountValue: 0,
    displayPriority: 10,
    buttonText: 'Shop Now',
    buttonUrl: '',
    status: 'Active',
    saleStartDate: new Date().toISOString().slice(0, 16),
    saleEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const fetchFlashSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/v1/flash-sales', {
        params: { _t: Date.now() },
      });
      if (res.data.success) {
        setFlashSales(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load flash sale campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/products', {
        params: { pageSize: 100, status: 'Active', _t: Date.now() },
      });
      if (res.data.success || res.data.products) {
        setProducts(res.data.products || res.data.data || []);
      }
    } catch (err) {
      console.warn('Error fetching inventory products:', err.message);
    }
  };

  useEffect(() => {
    fetchFlashSales();
    fetchProducts();
  }, []);

  const handleOpenModal = (sale = null) => {
    if (sale) {
      setEditingId(sale._id);
      const prod = sale.productId || {};
      setSelectedProduct(typeof prod === 'object' ? prod : null);
      setFormData({
        saleName: sale.saleName || '',
        productId: typeof prod === 'object' ? prod._id : prod,
        badge: sale.badge || 'Flash Sale',
        salePrice: sale.salePrice || 0,
        originalPrice: sale.originalPrice || 0,
        discountType: sale.discountType || 'Percentage',
        discountValue: sale.discountValue || 0,
        displayPriority: sale.displayPriority || 1,
        buttonText: sale.buttonText || 'Shop Now',
        buttonUrl: sale.buttonUrl || '',
        status: sale.status || 'Active',
        saleStartDate: sale.saleStartDate ? new Date(sale.saleStartDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        saleEndDate: sale.saleEndDate ? new Date(sale.saleEndDate).toISOString().slice(0, 16) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      });
    } else {
      setEditingId(null);
      setSelectedProduct(null);
      setFormData({
        saleName: '',
        productId: '',
        badge: 'Flash Sale',
        salePrice: 0,
        originalPrice: 0,
        discountType: 'Percentage',
        discountValue: 0,
        displayPriority: 10,
        buttonText: 'Shop Now',
        buttonUrl: '',
        status: 'Active',
        saleStartDate: new Date().toISOString().slice(0, 16),
        saleEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      });
    }
    setIsModalOpen(true);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    const original = product.price || 1999;
    const saleP = Math.round(original * 0.8);
    const discount = Math.round(((original - saleP) / original) * 100);

    setFormData((prev) => ({
      ...prev,
      productId: product._id || product.id,
      saleName: prev.saleName || `${product.name} Deal`,
      originalPrice: original,
      salePrice: saleP,
      discountValue: discount,
      buttonUrl: `/product/${product.slug}`,
    }));
    setShowProductSelector(false);
    toast.success(`Linked product: ${product.name}`);
  };

  const handlePriceChange = (field, value) => {
    const numericValue = parseFloat(value) || 0;
    setFormData((prev) => {
      const orig = field === 'originalPrice' ? numericValue : prev.originalPrice;
      const sale = field === 'salePrice' ? numericValue : prev.salePrice;
      let disc = 0;
      if (orig > sale && orig > 0) {
        if (prev.discountType === 'Fixed Amount') {
          disc = orig - sale;
        } else {
          disc = Math.round(((orig - sale) / orig) * 100);
        }
      }
      return { ...prev, [field]: numericValue, discountValue: disc };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error('Please select a product from the database first.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/v1/flash-sales/${editingId}`, formData);
        toast.success('Hero Flash Sale campaign updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/v1/flash-sales', formData);
        toast.success('New Hero Flash Sale launched successfully!');
      }
      setIsModalOpen(false);
      fetchFlashSales();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving flash sale.');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.patch(`http://localhost:5000/api/v1/flash-sales/${id}/status`, { status: nextStatus });
      toast.success(`Campaign turned ${nextStatus}`);
      fetchFlashSales();
    } catch (err) {
      toast.error('Failed to update campaign status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this Hero Flash Sale?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/flash-sales/${id}`);
      toast.success('Campaign removed');
      fetchFlashSales();
    } catch (err) {
      toast.error('Failed to delete campaign');
    }
  };

  const filteredSales = flashSales.filter(s => 
    s.saleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.productId?.name && s.productId.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Stats calculation
  const totalViews = flashSales.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const totalClicks = flashSales.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);
  const activeCount = flashSales.filter(s => s.status === 'Active').length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 rounded-3xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FiTag /> Marketing Module
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Hero Flash Sale Management</h1>
          <p className="text-gray-300 text-sm mt-1 max-w-xl">
            Configure homepage Hero Flash Sale deals, discounts, schedules, and countdowns dynamically. Only one campaign will be featured on the storefront based on schedule and priority.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-orange-500/30 shrink-0 w-fit active:scale-95 cursor-pointer"
        >
          <FiPlus className="text-lg" /> Create Flash Sale
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Campaigns</span>
            <div className="text-3xl font-black text-gray-900 mt-1">{flashSales.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
            <FiShoppingBag />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Deals</span>
            <div className="text-3xl font-black text-green-600 mt-1">{activeCount}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">
            <FiCheckCircle />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Storefront Impressions</span>
            <div className="text-3xl font-black text-purple-600 mt-1">{totalViews.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
            <FiEye />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deal Clicks & Engagement</span>
            <div className="text-3xl font-black text-orange-600 mt-1">{totalClicks.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold">
            <FiMousePointer />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaign or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div className="text-xs text-gray-500 font-semibold">
          * Highest priority active campaign within scheduled dates is automatically displayed beside the Hero Slider.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 text-xs uppercase font-extrabold tracking-wider">
                <th className="py-4 px-6">Campaign & Linked Product</th>
                <th className="py-4 px-6">Pricing & Discount</th>
                <th className="py-4 px-6">Schedule Duration</th>
                <th className="py-4 px-6 text-center">Priority</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 font-bold">
                    Loading Hero Flash Sales...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 font-medium">
                    No flash sale campaigns matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const prod = sale.productId || {};
                  return (
                    <tr key={sale._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0" />
                          ) : (
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold">No Img</div>
                          )}
                          <div>
                            <div className="font-extrabold text-gray-900 text-base">{sale.saleName}</div>
                            <div className="text-xs text-orange-600 font-bold mt-0.5 flex items-center gap-2">
                              <span>{prod.name || 'Unknown Product'}</span>
                              <span className="bg-orange-100 px-1.5 py-0.5 rounded text-[10px] uppercase text-orange-800">{sale.badge}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="text-base font-black text-gray-900">${sale.salePrice.toLocaleString()}</span>
                          <span className="text-xs text-gray-400 line-through ml-2 font-semibold">${sale.originalPrice.toLocaleString()}</span>
                        </div>
                        <span className="inline-block mt-1 bg-red-100 text-red-700 text-xs font-black px-2 py-0.5 rounded">
                          -{sale.discountValue}{sale.discountType === 'Percentage' ? '%' : ' OFF'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs space-y-1 font-medium text-gray-600">
                          <div><strong>Start:</strong> {new Date(sale.saleStartDate).toLocaleString()}</div>
                          <div><strong>End:</strong> {new Date(sale.saleEndDate).toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-black inline-flex items-center justify-center border border-gray-200">
                          {sale.displayPriority}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleStatus(sale._id, sale.status)}
                          className={`px-3 py-1.5 rounded-full text-xs font-black tracking-wide cursor-pointer transition-transform active:scale-95 ${
                            sale.status === 'Active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {sale.status}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(sale)}
                          className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors inline-block cursor-pointer"
                          title="Edit Campaign"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(sale._id)}
                          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-block cursor-pointer"
                          title="Delete Campaign"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">
                    {editingId ? 'Edit Hero Flash Sale' : 'Launch New Hero Flash Sale'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Select a database product and configure promotional countdown schedules.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Searchable Product Selector Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">Linked Store Product</label>
                    <button
                      type="button"
                      onClick={() => setShowProductSelector(!showProductSelector)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                    >
                      {showProductSelector ? 'Hide Selector' : '🔍 Select from Database'}
                    </button>
                  </div>

                  {selectedProduct ? (
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200">
                      <img src={selectedProduct.image || 'https://via.placeholder.com/80'} alt={selectedProduct.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{selectedProduct.name}</div>
                        <div className="text-xs text-gray-500">Brand: <strong>{selectedProduct.brand || 'General'}</strong> | Original Price: <strong>${selectedProduct.price?.toLocaleString()}</strong></div>
                        <div className="text-[11px] text-blue-600 mt-0.5 truncate max-w-[280px]">Link: /product/{selectedProduct.slug}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic bg-white p-4 rounded-xl border border-dashed border-gray-300 text-center">
                      No product linked yet. Click "Select from Database" above to pick a product.
                    </div>
                  )}

                  {/* Search Dropdown Modal */}
                  {showProductSelector && (
                    <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-lg space-y-3">
                      <input
                        type="text"
                        placeholder="Filter products by title, brand, or category..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                      />
                      <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-gray-100">
                        {filteredProducts.slice(0, 10).map((prod) => (
                          <div
                            key={prod._id || prod.id}
                            onClick={() => handleSelectProduct(prod)}
                            className="flex items-center justify-between py-2 px-2 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img src={prod.image} alt={prod.name} className="w-8 h-8 object-cover rounded" />
                              <div>
                                <div className="font-bold text-xs text-gray-900">{prod.name}</div>
                                <div className="text-[10px] text-gray-500">{prod.brand} • ${prod.price}</div>
                              </div>
                            </div>
                            <span className="text-xs font-black text-orange-600">Select →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Campaign Name</label>
                    <input
                      type="text"
                      value={formData.saleName}
                      onChange={(e) => setFormData({ ...formData, saleName: e.target.value })}
                      placeholder="e.g. Galaxy Ultra Mega Deal"
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Flash Sale / Limited Offer"
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Original Price ($)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => handlePriceChange('originalPrice', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Sale Price ($)</label>
                    <input
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handlePriceChange('salePrice', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Discount ({formData.discountType === 'Percentage' ? '%' : '$'})</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.discountType}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-xs font-bold focus:outline-none"
                      >
                        <option value="Percentage">%</option>
                        <option value="Fixed Amount">$</option>
                      </select>
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                        required
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-red-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.saleStartDate}
                      onChange={(e) => setFormData({ ...formData, saleStartDate: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.saleEndDate}
                      onChange={(e) => setFormData({ ...formData, saleEndDate: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Display Priority</label>
                    <input
                      type="number"
                      value={formData.displayPriority}
                      onChange={(e) => setFormData({ ...formData, displayPriority: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black focus:outline-none focus:border-orange-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-orange-500/30 transition-all active:scale-95 cursor-pointer"
                  >
                    {editingId ? 'Update Campaign' : 'Launch Campaign'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroFlashSaleManager;
