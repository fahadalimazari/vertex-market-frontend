import { useState, useEffect } from 'react';
import { useLogs } from '../../context/Admin/LogsContext';
import { FiSave, FiSmartphone, FiPlus, FiTrash2, FiExternalLink, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AppSettingsManager = () => {
  const { addLog } = useLogs();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  const [settings, setSettings] = useState({
    androidLink: 'https://play.google.com/store/apps',
    iosLink: 'https://apps.apple.com/app',
    appGalleryLink: 'https://appgallery.huawei.com',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://vertex-market.com/app-download',
    version: '2.4.0',
    status: 'Active',
    features: [
      'Faster Checkout',
      'Exclusive Discounts',
      'AI Shopping Assistant',
      'Order Tracking',
      'Flash Sales'
    ]
  });

  const getAuthToken = () => {
    const data = localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1');
    if (data) {
      const user = JSON.parse(data);
      return user.token;
    }
    return null;
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/app-settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings({
          androidLink: data.data.androidLink || '',
          iosLink: data.data.iosLink || '',
          appGalleryLink: data.data.appGalleryLink || '',
          qrCode: data.data.qrCode || '',
          version: data.data.version || '2.4.0',
          status: data.data.status || 'Active',
          features: data.data.features || [],
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Could not load app settings from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    setSettings(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const removeFeature = (idx) => {
    setSettings(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch('https://vertex-market-backend.vercel.app/api/v1/app-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success('Mobile App settings deployed globally!');
        if (addLog) addLog('App Settings Updated', `Updated store links and feature array for mobile application v${settings.version}.`);
      } else {
        toast.error(data.message || 'Failed to update settings.');
      }
    } catch (error) {
      console.error('Failed to save app settings:', error);
      toast.error('Network error while saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <FiRefreshCw className="text-2xl animate-spin text-[#ff6a00] mr-2" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading Mobile App Config...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiSmartphone className="text-[#ff6a00] text-2xl" /> Mobile App & Top Header Control
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage dynamic store download URLs, QR target links, app version, and promotional features displayed in the frontend Top Header popup.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all shrink-0"
        >
          <FiSave className="text-base" />
          <span>{saving ? 'Deploying...' : 'Deploy Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Link Configuration */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2 flex items-center justify-between">
            <span>Store Endpoints & Versioning</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${settings.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {settings.status}
            </span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">App Version Tag</label>
              <input
                type="text"
                required
                value={settings.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                placeholder="e.g. 2.4.0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Display Status</label>
              <select
                value={settings.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs bg-white font-bold text-gray-700"
              >
                <option value="Active">Active & Visible</option>
                <option value="Inactive">Inactive / Hidden</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Google Play Store URL</label>
            <input
              type="url"
              required
              value={settings.androidLink}
              onChange={(e) => handleInputChange('androidLink', e.target.value)}
              placeholder="https://play.google.com/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs text-gray-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Apple App Store URL</label>
            <input
              type="url"
              required
              value={settings.iosLink}
              onChange={(e) => handleInputChange('iosLink', e.target.value)}
              placeholder="https://apps.apple.com/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs text-gray-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Huawei AppGallery URL (Optional)</label>
            <input
              type="url"
              value={settings.appGalleryLink}
              onChange={(e) => handleInputChange('appGalleryLink', e.target.value)}
              placeholder="https://appgallery.huawei.com/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs text-gray-700 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">QR Code Target URL or Image Link</label>
            <input
              type="url"
              value={settings.qrCode}
              onChange={(e) => handleInputChange('qrCode', e.target.value)}
              placeholder="https://api.qrserver.com/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs text-gray-700 font-medium"
            />
            <p className="text-[10px] text-gray-400 mt-1">This link renders the interactive QR box when shoppers click "Save more on App".</p>
          </div>
        </form>

        {/* Right Column: Dynamic Features & Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Feature Array Management */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
              Promoted App Features
            </h3>
            
            <ul className="space-y-2">
              {(settings.features || []).map((feat, idx) => (
                <li key={idx} className="flex items-center justify-between px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200/60 text-xs font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-[#ff6a00]" />
                    <span>{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                    title="Remove Feature"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add benefit (e.g. Flash Discounts)"
                  className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#ff6a00]"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  <FiPlus /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Live QR Code Preview */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-6 rounded-3xl border border-gray-800 text-center text-white shadow-xl space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-orange-500 block">
              Frontend QR Preview
            </span>
            <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto border-2 border-orange-500/30 shadow-lg flex items-center justify-center">
              {settings.qrCode ? (
                <img src={settings.qrCode} alt="QR Code Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">No QR link</span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
              Changes applied here instantly reflect across all devices viewing the storefront Top Header.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AppSettingsManager;
