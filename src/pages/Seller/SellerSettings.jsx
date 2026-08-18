import { useState, useEffect } from 'react';
import { FiSave, FiImage, FiSettings } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { sessionService } from '../../services/auth/sessionService';
import { useAuth } from '../../context/AuthContext';

const SellerSettings = () => {
  const { refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [values, setValues] = useState({
    name: '',
    description: '',
    logo: '',
    banner: '',
    email: '',
    phone: '',
    address: '',
    facebook: '',
    twitter: '',
    hours: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = sessionService.getSession()?.token;
        const res = await axios.get('http://127.0.0.1:5000/api/v1/seller/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          const seller = res.data.data;
          setValues({
            name: seller.storeName || '',
            description: seller.storeDescription || '',
            logo: seller.storeLogo || '',
            banner: seller.storeBanner || '',
            email: seller.contactEmail || '',
            phone: seller.contactPhone || '',
            address: '', // Since address isn't directly in Seller schema we'll just mock it or leave blank
            facebook: '',
            twitter: '',
            hours: ''
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const toastId = toast.loading('Uploading image...');
    try {
      const token = sessionService.getSession()?.token;
      const res = await axios.post('http://127.0.0.1:5000/api/v1/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      if (res.data.success) {
        const fullUrl = res.data.url.startsWith('http') ? res.data.url : `http://127.0.0.1:5000${res.data.url}`;
        setValues(prev => ({ ...prev, [field]: fullUrl }));
        toast.success('Image uploaded successfully', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const handleInputChange = (field, val) => {
    setValues(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionService.getSession()?.token;
      // Save settings
      await axios.put('http://127.0.0.1:5000/api/v1/seller/settings', {
        storeName: values.name,
        storeDescription: values.description,
        contactEmail: values.email,
        contactPhone: values.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Also update theme if they changed logo/banner here
      await axios.put('http://127.0.0.1:5000/api/v1/seller/theme', {
        storeLogo: values.logo,
        storeBanner: values.banner
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await refreshSession();
      toast.success('Store settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-6 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiSettings className="text-[#ff6a00]" /> Store Settings
        </h2>
        <p className="text-xs text-gray-500 mt-1">Configure your public store details, banners, and operating hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: logo and banner preview */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4 text-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
              Store Branding
            </h3>
            
            {/* Logo Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-500 block">Store Logo</span>
              <div className="relative h-24 w-24 mx-auto bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2 group overflow-hidden cursor-pointer">
                {values.logo ? (
                  <img
                    src={values.logo}
                    alt="Store Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <FiImage className="text-gray-300 text-2xl" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-bold">Upload</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload Logo"
                />
              </div>
            </div>

            {/* Banner Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-500 block">Banner Preview</span>
              <div className="relative aspect-[16/6] w-full bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center group cursor-pointer">
                {values.banner ? (
                  <img
                    src={values.banner}
                    alt="Store Banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiImage className="text-gray-300 text-2xl" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-bold">Upload Banner</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload Banner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: detailed form fields */}
        <div className="md:col-span-2 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-5 min-w-0 w-full">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
            Store Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Store Display Name</label>
              <input
                type="text"
                required
                value={values.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Operating Hours</label>
              <input
                type="text"
                value={values.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={3}
              value={values.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contact Email</label>
              <input
                type="email"
                required
                value={values.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contact Phone</label>
              <input
                type="text"
                required
                value={values.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Store Address</label>
            <input
              type="text"
              required
              value={values.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ff6a00] outline-none text-xs"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 sm:p-1.5 shadow-md disabled:opacity-70 w-full sm:w-auto"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave className="h-4.5 w-4.5 shrink-0" />}
              <span className="shrink-0">{loading ? 'Saving...' : 'Save Configurations'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default SellerSettings;
