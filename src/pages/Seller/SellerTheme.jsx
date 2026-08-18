import { useState, useEffect } from 'react';
import { FiMonitor, FiUploadCloud, FiImage, FiSave, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { sessionService } from '../../services/auth/sessionService';
import { useAuth } from '../../context/AuthContext';

const SellerTheme = () => {
  const { refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [themeData, setThemeData] = useState({
    storeBanner: '',
    storeLogo: '',
    brandColor: '#ff6a00'
  });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const token = sessionService.getSession()?.token;
        const res = await axios.get('http://127.0.0.1:5000/api/v1/seller/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setThemeData({
            storeBanner: res.data.data.storeBanner || '',
            storeLogo: res.data.data.storeLogo || '',
            brandColor: res.data.data.brandColor || '#ff6a00'
          });
        }
      } catch (error) {
        console.error('Failed to load theme data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTheme();
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
        // Construct full URL since backend returns relative path
        const fullUrl = res.data.url.startsWith('http') ? res.data.url : `http://127.0.0.1:5000${res.data.url}`;
        setThemeData(prev => ({ ...prev, [field]: fullUrl }));
        toast.success('Image uploaded successfully', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to upload image', { id: toastId });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const toastId = toast.loading('Saving changes...');
    try {
      const token = sessionService.getSession()?.token;
      await axios.put('http://127.0.0.1:5000/api/v1/seller/theme', themeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshSession();
      toast.success('Store theme updated successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to update theme.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-6 text-center text-gray-500">Loading theme settings...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiMonitor className="text-[#ff6a00]" /> Store Theme & Banner
          </h1>
          <p className="text-sm text-gray-500 mt-1">Customize how your store appears to customers.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-1 sm:p-2 transition-colors disabled:opacity-70"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
        
        {/* Banner Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FiImage /> Store Banner
          </h3>
          <p className="text-xs text-gray-500 mb-4">Recommended size: 1200x300px. Max 2MB.</p>
          <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-2 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group overflow-hidden min-h-[160px]">
            {themeData.storeBanner ? (
              <img src={themeData.storeBanner} alt="Store Banner" className="w-full h-40 object-cover rounded-xl" />
            ) : (
              <div className="flex flex-col items-center p-8">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-[#ff6a00] mb-3 group-hover:scale-110 transition-transform">
                  <FiUploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700">Click to upload banner image</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'storeBanner')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Logo Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Store Logo</h3>
          <div className="flex gap-6 items-center">
            <div className="relative w-24 h-24 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden hover:bg-gray-100 transition-colors group cursor-pointer shadow-sm">
              {themeData.storeLogo ? (
                <img src={themeData.storeLogo} alt="Store Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-gray-500">Logo</span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <FiUploadCloud className="text-white text-xl" />
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'storeLogo')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-500">
              <p className="font-bold text-gray-700 mb-1">Upload Store Logo</p>
              <p className="text-xs">Square image recommended. Max 2MB.</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Theme Color */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Brand Color</h3>
          <p className="text-xs text-gray-500 mb-4">This color will be used for buttons on your dedicated store page.</p>
          <div className="flex items-center gap-4">
            <input 
              type="color" 
              value={themeData.brandColor}
              onChange={(e) => setThemeData({ ...themeData, brandColor: e.target.value })}
              className="w-12 h-12 p-1 rounded cursor-pointer" 
            />
            <input 
              type="text" 
              value={themeData.brandColor}
              onChange={(e) => setThemeData({ ...themeData, brandColor: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono w-28 outline-none focus:border-[#ff6a00]" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerTheme;
