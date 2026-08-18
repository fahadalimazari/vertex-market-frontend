import { useState } from 'react';
import { useCoupons } from '../../context/Admin/CouponContext';
import { useLogs } from '../../context/Admin/LogsContext';
import { FiPlus, FiTag, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const Coupons = () => {
  const { coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useCoupons();
  const { addLog } = useLogs();
  const [showAddForm, setShowAddForm] = useState(false);

  const [formValues, setFormValues] = useState({
    code: '',
    type: 'percentage',
    discount: '',
    startDate: '',
    endDate: '',
    usageLimit: '100'
  });

  const handleInputChange = (field, val) => {
    setFormValues(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCoupon({
      ...formValues,
      discount: Number(formValues.discount),
      usageLimit: Number(formValues.usageLimit)
    });
    addLog('Coupon Created', `Created discount coupon code: "${formValues.code}"`);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiTag className="text-[#ff6a00]" /> Promo Coupons Manager
          </h2>
          <p className="text-xs text-gray-500 mt-1">Design and manage global client coupon codes.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 bg-[#ff6a00] hover:bg-[#e05e00] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <FiPlus className="h-4 w-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Coupons Table List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <th className="p-4 pl-6">Coupon Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Limit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-755">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-[#ff6a00]">{c.code}</td>
                  <td className="p-4 capitalize text-gray-500">{c.type.replace('_', ' ')}</td>
                  <td className="p-4 font-bold text-gray-900">
                    {c.type === 'percentage' ? `${c.discount}%` : c.type === 'free_shipping' ? 'Free Ship' : `Rs. ${c.discount}`}
                  </td>
                  <td className="p-4 text-gray-400">{c.endDate}</td>
                  <td className="p-4 text-gray-600 font-semibold">{c.usageLimit} uses</td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        toggleCouponStatus(c.code);
                        addLog('Coupon Status Updated', `Toggled active status for: "${c.code}"`);
                      }}
                      className="text-lg text-gray-600 focus:outline-none"
                    >
                      {c.status === 'Active' ? (
                        <FiToggleRight className="text-green-600 text-2xl" />
                      ) : (
                        <FiToggleLeft className="text-gray-300 text-2xl" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm('Delete coupon permanently?')) {
                          deleteCoupon(c.code);
                          addLog('Coupon Deleted', `Deleted coupon code: "${c.code}"`);
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-550 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Coupon Modal overlay */}
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
                    value={formValues.discount}
                    onChange={(e) => handleInputChange('discount', e.target.value)}
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

export default Coupons;
