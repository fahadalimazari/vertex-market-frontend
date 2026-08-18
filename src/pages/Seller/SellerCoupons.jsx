import { useState, useEffect } from 'react';
import { sellerService } from '../../services/seller/sellerService';
import { FiPlus, FiTag, FiTrash2, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formValues, setFormValues] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    maxUsage: '100',
    expiryDate: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getCoupons();
      if (res.success) {
        setCoupons(res.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, val) => {
    setFormValues(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sellerService.createCoupon({
        ...formValues,
        discountValue: Number(formValues.discountValue),
        maxUsage: Number(formValues.maxUsage)
      });
      if (res.success) {
        toast.success('Coupon created successfully');
        setFormValues({
          code: '',
          discountType: 'PERCENTAGE',
          discountValue: '',
          maxUsage: '100',
          expiryDate: ''
        });
        setShowAddForm(false);
        fetchCoupons();
      }
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const { sessionService } = await import('../../services/auth/sessionService');
      const token = sessionService.getSession()?.token;
      const res = await fetch(`http://localhost:5000/api/v1/seller/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon deleted');
        fetchCoupons();
      }
    } catch (error) {
      toast.error('Failed to delete coupon');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiTag className="text-[#ff6a00]" /> Coupon Codes
          </h2>
          <p className="text-xs text-gray-500 mt-1">Design and manage customer coupon discounts.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 bg-[#ff6a00] hover:bg-[#e05e00] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <FiPlus className="h-4 w-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Coupons List Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-w-0 w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                <th className="px-1 sm:px-4 py-2 sm:py-4 sm:pl-6 whitespace-normal sm:whitespace-nowrap">Coupon Code</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Type</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Value</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Usage Limit</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Status</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 text-center whitespace-normal sm:whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-1 sm:px-4 py-2 sm:py-4 sm:pl-6 font-mono font-bold text-[#ff6a00] whitespace-normal sm:whitespace-nowrap">{coupon.code}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 capitalize text-gray-500 whitespace-normal sm:whitespace-nowrap">{coupon.discountType.replace('_', ' ')}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 font-bold text-gray-900 whitespace-normal sm:whitespace-nowrap">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : coupon.discountType === 'FREE_SHIPPING' ? 'Free Ship' : `Rs. ${coupon.discountValue}`}
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-600 whitespace-normal sm:whitespace-nowrap">
                    {coupon.currentUsage} / {coupon.maxUsage || '∞'}
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${coupon.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-center whitespace-normal sm:whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Delete coupon"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No active discount codes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Coupon Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1"
            >
              x
            </button>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">Create Coupon Code</h3>
            <p className="text-xs text-gray-500 mb-4">Set discount ratios and parameters.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  value={formValues.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE25"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formValues.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Value
                  </label>
                  <input
                    type="number"
                    disabled={formValues.type === 'free_shipping'}
                    required={formValues.type !== 'free_shipping'}
                    value={formValues.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    placeholder="Discount value"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    required
                    value={formValues.usageLimit}
                    onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formValues.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff6a00] hover:bg-[#e05e00] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCoupons;
