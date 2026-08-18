import { useState } from 'react';
import { useMarketplaceSettings } from '../../context/Admin/MarketplaceSettingsContext';
import { useLogs } from '../../context/Admin/LogsContext';
import { FiSave, FiShield } from 'react-icons/fi';

const Settings = () => {
  const { settings, updateSettings } = useMarketplaceSettings();
  const { addLog } = useLogs();

  const [values, setValues] = useState({
    storeName: settings.storeName,
    currency: settings.currency,
    taxRate: settings.taxRate,
    defaultShippingFee: settings.defaultShippingFee,
    enableAI: settings.enableAI,
    metaTitle: settings.metaTitle,
    metaDescription: settings.metaDescription
  });

  const handleInputChange = (field, val) => {
    setValues(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(values);
    addLog('Marketplace Settings Updated', 'Modified currency, tax margins, or shipping variables.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiShield className="text-[#ff6a00]" /> General Settings
        </h2>
        <p className="text-xs text-gray-500 mt-1">Configure taxes, default currencies, shipping rates, and SEO metadata.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
          Marketplace Operational Configurations
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Marketplace Brand Title</label>
            <input
              type="text"
              required
              value={values.storeName}
              onChange={(e) => handleInputChange('storeName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Base Currency</label>
            <select
              value={values.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs bg-white"
            >
              <option value="PKR">PKR (Rs.)</option>
              <option value="USD">USD ($)</option>
              <option value="AED">AED (Dh.)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Standard VAT / Sales Tax (%)</label>
            <input
              type="number"
              required
              value={values.taxRate}
              onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Base Shipping Rate (Rs.)</label>
            <input
              type="number"
              required
              value={values.defaultShippingFee}
              onChange={(e) => handleInputChange('defaultShippingFee', Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-50">
          <button
            type="submit"
            className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <FiSave className="h-4.5 w-4.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
